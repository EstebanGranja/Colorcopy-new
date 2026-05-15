/* global React, Icon */
const { useState: useStateC, useEffect: useEffectC, useRef: useRefC } = React;

function Chatbot() {
  const [open, setOpen] = useStateC(false);
  const [messages, setMessages] = useStateC([
    { from: "bot", text: "¡Hola! Soy Tinta, la asistente de Colorcopy. ¿En qué te puedo ayudar?" },
  ]);
  const [showChips, setShowChips] = useStateC(true);
  const [typing, setTyping] = useStateC(false);
  const [input, setInput] = useStateC("");
  const [finalize, setFinalize] = useStateC(null);
  const bodyRef = useRefC(null);
  const engineRef = useRefC(null);

  const chips = [
    "Quiero hacer un pedido",
    "Cotizar cartelería",
    "Tiempos de entrega",
    "Hablar con humano",
  ];

  useEffectC(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, typing, open, finalize]);

  useEffectC(() => {
    window.openChat = () => setOpen(true);
    window.closeChat = () => setOpen(false);
    return () => { delete window.openChat; delete window.closeChat; };
  }, []);

  useEffectC(() => {
    if (open) document.body.classList.add("chat-open");
    else document.body.classList.remove("chat-open");
    return () => document.body.classList.remove("chat-open");
  }, [open]);

  useEffectC(() => {
    if (!engineRef.current && window.ChatClient) {
      engineRef.current = new window.ChatClient();
    }
  }, []);

  const send = async (text) => {
    if (!text.trim() || typing) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setShowChips(false);
    setTyping(true);
    setFinalize(null);

    if (!engineRef.current) {
      try { engineRef.current = new window.ChatClient(); }
      catch (e) {
        setTyping(false);
        setMessages((m) => [...m, { from: "bot", text: "El cliente del chat no está cargado. Recargá la página." }]);
        return;
      }
    }

    try {
      const res = await engineRef.current.send(text, {
        onMessage: (t) => {
          if (t && t.trim()) setMessages((m) => [...m, { from: "bot", text: t }]);
        },
      });
      if (res && res.finalize) {
        if (res.finalize.summaryMessage) {
          setMessages((m) => [...m, { from: "bot", text: res.finalize.summaryMessage }]);
        }
        setFinalize(res.finalize);
      }
    } catch (e) {
      setMessages((m) => [...m, { from: "bot", text: `⚠️ ${e.message}` }]);
    } finally {
      setTyping(false);
    }
  };

  const buildWaUrl = () => {
    if (!finalize || !engineRef.current) return "#";
    try {
      return window.buildWhatsAppUrl(engineRef.current.cart, finalize.customer_name, finalize.notes);
    } catch (e) {
      return "#";
    }
  };

  return (
    <>
      {!open && (
        <button className="chat-fab" onClick={() => setOpen(true)} aria-label="Abrir chat">
          <span className="ping"></span>
          <Icon.Robot width="32" height="32" />
        </button>
      )}
      {open && (
        <div className="chat-panel" role="dialog" aria-label="Chat con Colorcopy">
          <header className="chat-head">
            <div className="chat-avatar">CC</div>
            <div>
              <div className="chat-title">Tinta · Asistente</div>
              <div className="chat-status">
                <span className="dot"></span> En línea
              </div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Cerrar">
              <Icon.Close />
            </button>
          </header>

          <div className="chat-body" ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={"msg " + m.from}>{m.text}</div>
            ))}
            {showChips && (
              <div className="chat-chips">
                {chips.map((c) => (
                  <button key={c} className="chat-chip" onClick={() => send(c)}>{c}</button>
                ))}
              </div>
            )}
            {typing && (
              <div className="typing"><span></span><span></span><span></span></div>
            )}
            {finalize && (
              <a
                className="chat-whatsapp-cta"
                href={buildWaUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                  <path d="M16.003 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.26.59 4.47 1.71 6.42L3.2 28.8l6.55-1.69c1.88 1.02 4 1.56 6.16 1.56h.01c7.07 0 12.8-5.73 12.8-12.8s-5.73-12.8-12.79-12.8zm0 23.31h-.01c-1.92 0-3.81-.52-5.46-1.5l-.39-.23-3.89 1 1.04-3.79-.25-.4a10.6 10.6 0 0 1-1.62-5.59c0-5.86 4.77-10.62 10.63-10.62 2.84 0 5.51 1.11 7.52 3.12a10.55 10.55 0 0 1 3.11 7.52c0 5.86-4.77 10.62-10.63 10.62zm5.83-7.95c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.81 1.04-1 1.25-.18.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.76-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.53-.71-.54-.18-.01-.4-.01-.61-.01-.21 0-.55.08-.84.4-.29.32-1.1 1.07-1.1 2.62 0 1.55 1.13 3.04 1.29 3.25.16.21 2.23 3.4 5.4 4.77.75.32 1.34.51 1.8.66.76.24 1.45.21 2 .13.61-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37z"/>
                </svg>
                Enviar por WhatsApp
              </a>
            )}
          </div>

          <form
            className="chat-input"
            onSubmit={(e) => { e.preventDefault(); send(input); }}
          >
            <input
              placeholder="Escribí tu consulta…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="chat-send" aria-label="Enviar">
              <Icon.Send />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

Object.assign(window, { Chatbot });
