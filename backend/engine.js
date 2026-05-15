/* =========================================================
   Colorcopy chatbot — orchestrator engine (server-side)
   Recibe { messages, cart } del cliente, ejecuta el loop de tool calling
   y devuelve { reply, cart, finalize }.
   ========================================================= */
const { TOOL_SCHEMAS, executeTool } = require("./tools");
const { buildSystemPrompt } = require("./prompts");
const Cart = require("./cart");
const config = require("./config");

const providers = {
  ollama: require("./providers/ollama"),
  anthropic: require("./providers/anthropic"),
  openai: require("./providers/openai"),
};

const MAX_TOOL_LOOPS = 6;

async function runChat({ messages, cart }) {
  const provider = providers[config.provider];
  if (!provider) {
    throw new Error(`Provider invalido: ${config.provider}`);
  }

  // Inyectar el system prompt al inicio (con el catalogo serializado)
  const allMessages = [
    { role: "system", content: buildSystemPrompt() },
    ...messages,
  ];

  let safety = 0;
  let lastReply = "";
  let finalize = null;

  while (safety++ < MAX_TOOL_LOOPS) {
    const res = await provider.chat({
      messages: allMessages,
      tools: TOOL_SCHEMAS,
    });

    const toolNames = (res.toolCalls || []).map(t => (t.function && t.function.name) || t.name).join(", ") || "(none)";
    console.log(`[engine] turn ${safety} → tools: ${toolNames} · text: ${(res.content || "").slice(0, 80)}`);

    lastReply = res.content || lastReply;

    // Agregar la respuesta del asistente al historial
    const assistantMsg = {
      role: "assistant",
      content: res.content || "",
    };
    if (res.toolCalls && res.toolCalls.length) {
      assistantMsg.tool_calls = res.toolCalls;
    }
    allMessages.push(assistantMsg);

    // Si no hay tool calls, terminamos
    if (!res.toolCalls || !res.toolCalls.length) {
      break;
    }

    // Ejecutar cada tool y agregar el resultado
    for (const tc of res.toolCalls) {
      const result = executeTool(tc, cart);
      const fnName = (tc.function && tc.function.name) || tc.name;
      allMessages.push({
        role: "tool",
        name: fnName,
        tool_call_id: tc.id,
        content: JSON.stringify(result),
      });
      if (fnName === "finalize_order" && result && result.ready_for_whatsapp) {
        finalize = result;
      }
    }

    // finalize_order corta el loop
    if (finalize) break;
  }

  if (finalize) {
    finalize.summaryMessage = Cart.formatOrderSummary(cart);
  }
  return { reply: lastReply, cart, finalize };
}

module.exports = { runChat };
