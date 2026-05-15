/* =========================================================
   Colorcopy chatbot — tool schemas + executors (server-side)
   ========================================================= */
const Cart = require("./cart");

const TOOL_SCHEMAS = [
  {
    type: "function",
    function: {
      name: "add_to_cart",
      description:
        "Agrega un producto al pedido. Antes de llamar, asegurate de tener cantidad y todas las variaciones requeridas (consultarlas si faltan).",
      parameters: {
        type: "object",
        required: ["product_id", "quantity"],
        properties: {
          product_id: {
            type: "string",
            description: "id exacto del producto del catalogo (ej: 'vinilo-adhesivo')",
          },
          quantity: {
            type: "number",
            description:
              "cantidad o superficie segun el unit del producto. Para productos por m² es la superficie en m²; para productos por unidad es entera.",
          },
          variation: {
            type: "object",
            description:
              "objeto con las claves de variations definidas en el producto (ej: { terminacion: 'Brillante', superficie: 3 })",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "remove_from_cart",
      description: "Elimina un item del carrito por su indice (0-based) tal como aparece en view_cart.",
      parameters: {
        type: "object",
        required: ["item_index"],
        properties: {
          item_index: { type: "number", description: "indice del item a eliminar" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "view_cart",
      description: "Devuelve el contenido actual del carrito con totales estimados.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "finalize_order",
      description:
        "Cierra el pedido y dispara la UI para enviar por WhatsApp. Usalo solo cuando el cliente confirma que termino. Pedi su nombre antes (opcional).",
      parameters: {
        type: "object",
        properties: {
          customer_name: { type: "string", description: "nombre del cliente (opcional)" },
          notes: { type: "string", description: "notas o aclaraciones del pedido (opcional)" },
        },
      },
    },
  },
];

function parseArgs(args) {
  if (args == null) return {};
  if (typeof args === "string") {
    try {
      return JSON.parse(args);
    } catch (e) {
      return {};
    }
  }
  return args;
}

function executeTool(toolCall, cart) {
  const fn = toolCall.function || toolCall;
  const name = fn.name;
  const args = parseArgs(fn.arguments);

  switch (name) {
    case "add_to_cart":
      return Cart.addItem(cart, args);

    case "remove_from_cart":
      return Cart.removeItem(cart, args.item_index);

    case "view_cart":
      return {
        ok: true,
        items: Cart.cartSummary(cart),
        total_estimate: Cart.totalEstimate(cart),
      };

    case "finalize_order": {
      const items = Cart.cartSummary(cart);
      if (!items || items.length === 0) {
        return {
          ok: false,
          ready_for_whatsapp: false,
          error: "El carrito esta vacio. No podes finalizar un pedido sin items. Pedile al cliente que elija productos primero y agregalos con add_to_cart.",
        };
      }
      return {
        ok: true,
        ready_for_whatsapp: true,
        summary: items,
        customer_name: args.customer_name || null,
        notes: args.notes || null,
      };
    }

    default:
      return { ok: false, error: `Tool desconocida: ${name}` };
  }
}

module.exports = { TOOL_SCHEMAS, executeTool };
