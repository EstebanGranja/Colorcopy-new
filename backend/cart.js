/* =========================================================
   Colorcopy chatbot — cart helpers (server-side mutations)
   ========================================================= */
const CATALOG = require("../data/catalog.js");

function newCart() {
  return { items: [] };
}

function findProduct(productId) {
  for (const catKey of Object.keys(CATALOG)) {
    const cat = CATALOG[catKey];
    const item = (cat.items || []).find((p) => p.id === productId);
    if (item) return Object.assign({}, item, { category: catKey });
  }
  return null;
}

function priceToNumber(priceStr) {
  if (priceStr == null) return null;
  const cleaned = String(priceStr).replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

function estimateLine(item) {
  const unit = priceToNumber(item.unitPrice);
  if (unit == null || !item.quantity) return null;
  return unit * item.quantity;
}

function addItem(cart, { product_id, quantity, variation }) {
  const product = findProduct(product_id);
  if (!product) {
    return { ok: false, error: `Producto '${product_id}' no encontrado en el catalogo.` };
  }
  const qty = Number(quantity);
  if (!qty || qty <= 0) {
    return { ok: false, error: "La cantidad debe ser mayor a cero." };
  }
  const line = {
    productId: product.id,
    name: product.name,
    meta: product.meta,
    unit: product.unit,
    unitPrice: product.price,
    category: product.category,
    quantity: qty,
    variation: variation || {},
  };
  cart.items.push(line);
  return {
    ok: true,
    item_index: cart.items.length - 1,
    line: Object.assign({}, line, { lineTotalEstimate: estimateLine(line) }),
    cart_size: cart.items.length,
  };
}

function removeItem(cart, index) {
  const i = Number(index);
  if (!Number.isInteger(i) || i < 0 || i >= cart.items.length) {
    return { ok: false, error: `Indice invalido: ${index}` };
  }
  const removed = cart.items.splice(i, 1)[0];
  return { ok: true, removed, cart_size: cart.items.length };
}

function cartSummary(cart) {
  return cart.items.map((it, i) => ({
    index: i,
    name: it.name,
    quantity: it.quantity,
    unit: it.unit,
    unitPrice: it.unitPrice,
    variation: it.variation,
    lineTotalEstimate: estimateLine(it),
  }));
}

function totalEstimate(cart) {
  let sum = 0;
  let allKnown = true;
  for (const it of cart.items) {
    const line = estimateLine(it);
    if (line == null) allKnown = false;
    else sum += line;
  }
  return { value: sum, complete: allKnown };
}

function formatMoney(n) {
  if (n == null) return "";
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

function formatVariation(variation) {
  if (!variation || typeof variation !== "object") return "";
  return Object.entries(variation).map(([k, v]) => `${k}: ${v}`).join(" · ");
}

function formatOrderSummary(cart) {
  if (!cart.items.length) return "";
  const lines = ["Resumen de tu pedido:", ""];
  cart.items.forEach((it, i) => {
    const unitLabel = it.unit ? ` ${it.unit.replace(/^por\s+/i, "")}` : "";
    lines.push(`${i + 1}. ${it.name} — ${it.quantity}${unitLabel}`);
    const v = formatVariation(it.variation);
    if (v) lines.push(`   ${v}`);
    const line = estimateLine(it);
    if (line != null) {
      lines.push(`   ${it.unitPrice} ${it.unit} → ${formatMoney(line)}`);
    }
    lines.push("");
  });
  const total = totalEstimate(cart);
  lines.push(`Total estimado: ${formatMoney(total.value)}${total.complete ? "" : " (parcial)"}`);
  return lines.join("\n").trimEnd();
}

module.exports = {
  newCart,
  addItem,
  removeItem,
  cartSummary,
  totalEstimate,
  findProduct,
  formatOrderSummary,
};
