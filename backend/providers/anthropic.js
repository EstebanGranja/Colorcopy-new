/* =========================================================
   Colorcopy chatbot — Anthropic provider
   Uses @anthropic-ai/sdk with prompt caching on the system prompt.
   Translates between OpenAI/Ollama-style messages (used by the engine)
   and Anthropic's content-block format.
   ========================================================= */
const Anthropic = require("@anthropic-ai/sdk");
const config = require("../config");

async function chat({ messages, tools, signal }) {
  const cfg = config.anthropic;
  if (!cfg.apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY no seteada. Configurala en .env (dev local) o en las env vars de Netlify (produccion)."
    );
  }

  const client = new Anthropic({ apiKey: cfg.apiKey });

  // 1. Separar system del array de messages (Anthropic los maneja distinto)
  const systemMsg = messages.find((m) => m.role === "system");
  const convo = messages.filter((m) => m.role !== "system");
  const anthropicMessages = convertMessages(convo);

  // 2. Traducir tools de formato OpenAI a formato Anthropic
  const anthropicTools = (tools || []).map((t) => ({
    name: t.function.name,
    description: t.function.description,
    input_schema: t.function.parameters,
  }));

  // 3. Armar el request. cache_control sobre el system permite reutilizar
  //    el catalogo entre llamadas (-90% costo / -50% latencia post-cache hit).
  const requestBody = {
    model: cfg.model,
    max_tokens: cfg.maxTokens,
    messages: anthropicMessages,
  };

  if (systemMsg) {
    requestBody.system = [
      {
        type: "text",
        text: systemMsg.content,
        cache_control: { type: "ephemeral" },
      },
    ];
  }

  if (anthropicTools.length) {
    requestBody.tools = anthropicTools;
  }

  const response = await client.messages.create(requestBody, { signal });

  // 4. Extraer texto y tool_use blocks de la respuesta
  let content = "";
  const toolCalls = [];

  for (const block of response.content) {
    if (block.type === "text") {
      content += block.text;
    } else if (block.type === "tool_use") {
      toolCalls.push({
        id: block.id,
        function: {
          name: block.name,
          arguments: block.input, // ya viene parseado por la SDK
        },
      });
    }
  }

  return {
    content,
    toolCalls,
    raw: response,
    usage: response.usage,
  };
}

/* ---------------------------------------------------------
   Mensajes formato OpenAI/Ollama → formato Anthropic.

   - role:"user" string → { role:"user", content:string }
   - role:"assistant" con tool_calls → content blocks de text + tool_use
   - role:"tool" (multiples consecutivos) → 1 mensaje user con varios
     tool_result blocks
   --------------------------------------------------------- */
function convertMessages(messages) {
  const result = [];
  let i = 0;

  while (i < messages.length) {
    const msg = messages[i];

    if (msg.role === "user") {
      result.push({ role: "user", content: msg.content });
      i++;
    } else if (msg.role === "assistant") {
      const blocks = [];
      if (msg.content && msg.content.trim()) {
        blocks.push({ type: "text", text: msg.content });
      }
      if (Array.isArray(msg.tool_calls) && msg.tool_calls.length) {
        for (const tc of msg.tool_calls) {
          const fn = tc.function || tc;
          let input = fn.arguments;
          if (typeof input === "string") {
            try {
              input = JSON.parse(input);
            } catch (e) {
              input = {};
            }
          }
          blocks.push({
            type: "tool_use",
            id: tc.id || `call_${result.length}_${blocks.length}`,
            name: fn.name,
            input: input || {},
          });
        }
      }
      // Anthropic requiere al menos un block por turn
      if (!blocks.length) blocks.push({ type: "text", text: "(sin contenido)" });
      result.push({ role: "assistant", content: blocks });
      i++;
    } else if (msg.role === "tool") {
      // Agrupar tool messages consecutivos en un solo turn user
      const toolResults = [];
      while (i < messages.length && messages[i].role === "tool") {
        const tm = messages[i];
        const toolUseId = tm.tool_call_id || tm.tool_use_id;
        if (!toolUseId) {
          throw new Error(
            `Tool result sin tool_call_id (name=${tm.name}). El engine debe pasarlo siempre.`
          );
        }
        toolResults.push({
          type: "tool_result",
          tool_use_id: toolUseId,
          content:
            typeof tm.content === "string"
              ? tm.content
              : JSON.stringify(tm.content),
        });
        i++;
      }
      result.push({ role: "user", content: toolResults });
    } else {
      // Role desconocido — skip
      i++;
    }
  }

  return result;
}

module.exports = { chat };
