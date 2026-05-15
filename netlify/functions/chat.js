/* =========================================================
   Netlify Function: /.netlify/functions/chat
   HTTP entry point para el chatbot. Recibe { messages, cart }
   del cliente, corre el engine y devuelve { reply, cart, finalize }.
   ========================================================= */
const { runChat } = require("../../backend/engine");

exports.handler = async (event) => {
  // CORS preflight (no estrictamente necesario porque mismo origen,
  // pero util para testing con curl/herramientas)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (e) {
    return jsonResponse(400, { error: "Invalid JSON body" });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const cart =
    body.cart && typeof body.cart === "object" && Array.isArray(body.cart.items)
      ? body.cart
      : { items: [] };

  if (!messages.length) {
    return jsonResponse(400, { error: "Faltan messages en el body" });
  }

  try {
    const result = await runChat({ messages, cart });
    return jsonResponse(200, result);
  } catch (e) {
    console.error("[chat function] error:", e);
    return jsonResponse(500, { error: e.message || "Error interno" });
  }
};

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body),
  };
}
