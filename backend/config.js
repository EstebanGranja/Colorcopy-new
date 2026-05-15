/* =========================================================
   Colorcopy chatbot — backend config (reads env vars)
   ========================================================= */
module.exports = {
  provider: process.env.CHAT_PROVIDER || "ollama",
  ollama: {
    baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    model: process.env.OLLAMA_MODEL || "llama3.2:3b",
    options: { temperature: 0.2, top_p: 0.9 },
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001",
    maxTokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS || "1024", 10),
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
  },
};
