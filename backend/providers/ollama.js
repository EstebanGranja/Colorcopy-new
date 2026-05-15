/* =========================================================
   Colorcopy chatbot — Ollama provider (server-side, Node 18+ fetch)
   ========================================================= */
const config = require("../config");

async function chat({ messages, tools, signal }) {
  const cfg = config.ollama;
  const url = `${cfg.baseUrl.replace(/\/$/, "")}/api/chat`;
  const body = {
    model: cfg.model,
    messages,
    stream: false,
    options: cfg.options || {},
  };
  if (tools && tools.length) body.tools = tools;

  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
  } catch (err) {
    throw new Error(
      `No se pudo conectar a Ollama en ${cfg.baseUrl}. ¿Esta corriendo 'ollama serve'?`
    );
  }

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Ollama HTTP ${res.status}: ${txt.slice(0, 200)}`);
  }

  const data = await res.json();
  const message = data.message || {};
  const nativeToolCalls = Array.isArray(message.tool_calls) ? message.tool_calls : [];

  // Fallback: si no hay tool_calls nativos pero el content tiene JSON con
  // forma {"name": ..., "arguments": {...}}, los extraemos. Pasa con Qwen+Ollama.
  if (nativeToolCalls.length === 0 && message.content) {
    const extracted = extractToolCallsFromText(message.content);
    if (extracted.toolCalls.length) {
      return { content: extracted.content, toolCalls: extracted.toolCalls, raw: data };
    }
  }

  return {
    content: message.content || "",
    toolCalls: nativeToolCalls,
    raw: data,
  };
}

// Encuentra objetos JSON balanceados {} en un texto. Maneja strings escapados.
function findJsonObjects(text) {
  const results = [];
  let i = 0;
  while (i < text.length) {
    if (text[i] !== "{") { i++; continue; }
    let depth = 0, inStr = false, esc = false, start = i, found = false;
    for (let j = i; j < text.length; j++) {
      const c = text[j];
      if (esc) { esc = false; continue; }
      if (c === "\\") { esc = true; continue; }
      if (c === '"') { inStr = !inStr; continue; }
      if (inStr) continue;
      if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) {
          results.push({ start, end: j + 1, text: text.slice(start, j + 1) });
          i = j + 1; found = true; break;
        }
      }
    }
    if (!found) i++;
  }
  return results;
}

function extractToolCallsFromText(content) {
  const objs = findJsonObjects(content);
  const calls = [];
  const ranges = [];
  for (const obj of objs) {
    try {
      const parsed = JSON.parse(obj.text);
      if (parsed && typeof parsed.name === "string" && (parsed.arguments != null || parsed.parameters != null)) {
        calls.push({
          id: `ollama_extracted_${calls.length}`,
          function: { name: parsed.name, arguments: parsed.arguments || parsed.parameters || {} },
        });
        ranges.push([obj.start, obj.end]);
      }
    } catch (_) { /* no era JSON valido, ignorar */ }
  }
  if (!calls.length) return { content, toolCalls: [] };
  let cleaned = content;
  for (let k = ranges.length - 1; k >= 0; k--) {
    cleaned = cleaned.slice(0, ranges[k][0]) + cleaned.slice(ranges[k][1]);
  }
  return { content: cleaned.replace(/\s+/g, " ").trim(), toolCalls: calls };
}

module.exports = { chat };
