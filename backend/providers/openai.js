/* =========================================================
   Colorcopy chatbot — OpenAI provider (STUB)
   Completar cuando se necesite. Tools y messages estan en formato OpenAI
   nativo (es lo que usan tools.js y engine.js), asi que la implementacion
   real es directa: fetch a /v1/chat/completions con OPENAI_API_KEY.
   ========================================================= */
async function chat() {
  throw new Error(
    "OpenAI no esta configurado. Setea OPENAI_API_KEY en las env vars y completa la implementacion en backend/providers/openai.js"
  );
}

module.exports = { chat };
