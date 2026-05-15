/* =========================================================
   Colorcopy chatbot — frontend client
   Reemplaza al engine que vivia en el browser. Solo manda mensajes
   al backend (/.netlify/functions/chat) y mantiene el carrito local.
   Misma firma publica que el viejo ChatEngine para no romper chatbot.jsx.
   ========================================================= */
(function () {
  const ENDPOINT = "/.netlify/functions/chat";

  class ChatClient {
    constructor() {
      this.cart = window.Cart.newCart();
      this.history = [];
    }

    reset() {
      this.cart = window.Cart.newCart();
      this.history = [];
    }

    async send(userText, callbacks) {
      const onMessage = callbacks && callbacks.onMessage;

      this.history.push({ role: "user", content: userText });

      let res;
      try {
        res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: this.history,
            cart: this.cart,
          }),
        });
      } catch (e) {
        // Rollback del user message si falla la conexion
        this.history.pop();
        throw new Error(
          "No se pudo conectar al backend. ¿Esta corriendo `netlify dev` (o el sitio en produccion)?"
        );
      }

      if (!res.ok) {
        this.history.pop();
        let errMsg = `Backend HTTP ${res.status}`;
        try {
          const errBody = await res.json();
          if (errBody.error) errMsg = errBody.error;
        } catch (e) {}
        throw new Error(errMsg);
      }

      const data = await res.json();
      if (data.error) {
        this.history.pop();
        throw new Error(data.error);
      }

      // Update local state con lo que devolvio el backend
      const reply = data.reply || "";
      this.history.push({ role: "assistant", content: reply });
      if (data.cart) this.cart = data.cart;

      if (reply && onMessage) onMessage(reply);

      return {
        content: reply,
        finalize: data.finalize || null,
      };
    }
  }

  window.ChatClient = ChatClient;
})();
