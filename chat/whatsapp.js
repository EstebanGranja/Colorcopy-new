/* =========================================================
   Colorcopy chatbot — WhatsApp URL builder
   ========================================================= */
(function () {
  function formatVariation(variation) {
    if (!variation || typeof variation !== "object") return "";
    const parts = Object.entries(variation).map(([k, v]) => `${k}: ${v}`);
    return parts.length ? parts.join(", ") : "";
  }

  function formatMoney(n) {
    if (n == null) return "";
    return "$ " + n.toLocaleString("es-AR", { maximumFractionDigits: 0 });
  }

  function buildOrderMessage(cart, customerName, notes) {
    const lines = ["*Pedido Colorcopy*", ""];
    if (customerName) lines.push(`*Cliente:* ${customerName}`, "");

    if (!cart.items.length) {
      lines.push("(Pedido vacio)");
    } else {
      cart.items.forEach((it, i) => {
        const v = formatVariation(it.variation);
        const head = `${i + 1}. ${it.name} x${it.quantity}${it.unit ? ` ${it.unit.replace(/^por\s+/i, "")}` : ""}`;
        lines.push(head);
        if (v) lines.push(`   - ${v}`);
        if (it.unitPrice) lines.push(`   - Precio unitario: ${it.unitPrice}`);
      });
      const total = window.Cart.totalEstimate(cart);
      lines.push("");
      lines.push(`Total estimado: ${formatMoney(total.value)}${total.complete ? "" : " (parcial)"}`);
    }

    if (notes) lines.push("", `Notas: ${notes}`);
    return lines.join("\n");
  }

  function buildWhatsAppUrl(cart, customerName, notes) {
    const cfg = window.CHAT_CONFIG && window.CHAT_CONFIG.whatsapp;
    if (!cfg || !cfg.number) {
      throw new Error("Falta configurar CHAT_CONFIG.whatsapp.number");
    }
    const text = encodeURIComponent(buildOrderMessage(cart, customerName, notes));
    return `https://wa.me/${cfg.number}?text=${text}`;
  }

  window.buildWhatsAppUrl = buildWhatsAppUrl;
  window.buildOrderMessage = buildOrderMessage;
})();
