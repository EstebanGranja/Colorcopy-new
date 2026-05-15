/* global React */
const { useState, useEffect, useRef } = React;

/* =========================================================
   Icons (inline SVG, monoline)
   ========================================================= */
const Icon = {
  Instagram: (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5"></rect>
      <circle cx="12" cy="12" r="4"></circle>
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"></circle>
    </svg>
  ),
  Facebook: (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  ),
  Whatsapp: (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-3.6-7.2L21 3l-1.2 3.6A9 9 0 0 1 21 12z"></path>
      <path d="M8 11c0.5 2 1.8 3.5 4 4 1 0.3 2-0.2 2.5-1l-2-1c-0.5 0.3-1 0.3-1.5 0-0.8-0.5-1.3-1.2-1.5-2 0-0.5 0-1 0.5-1.3l-1-2c-0.8 0.3-1.3 1.3-1 2.3z"></path>
    </svg>
  ),
  Arrow: (p) => (
    <svg {...p} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6"></path>
    </svg>
  ),
  ArrowUpRight: (p) => (
    <svg {...p} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7M9 7h8v8"></path>
    </svg>
  ),
  Robot: (p) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <line x1="12" y1="2" x2="12" y2="5"></line>
      <circle cx="12" cy="2" r="1" fill="currentColor" stroke="none"></circle>
      <rect x="4" y="6" width="16" height="12" rx="2.5"></rect>
      <line x1="2.5" y1="11" x2="2.5" y2="14"></line>
      <line x1="21.5" y1="11" x2="21.5" y2="14"></line>
      <circle cx="9" cy="11.5" r="1.2" fill="currentColor" stroke="none"></circle>
      <circle cx="15" cy="11.5" r="1.2" fill="currentColor" stroke="none"></circle>
      <path d="M9.5 15h5"></path>
    </svg>
  ),
  Chat: (p) => (
    <svg {...p} width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16v11H8l-4 4z"></path>
      <circle cx="9" cy="10.5" r="1" fill="currentColor"></circle>
      <circle cx="13" cy="10.5" r="1" fill="currentColor"></circle>
      <circle cx="17" cy="10.5" r="1" fill="currentColor"></circle>
    </svg>
  ),
  Close: (p) => (
    <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6 6 18"></path>
    </svg>
  ),
  Send: (p) => (
    <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2 11 13"></path>
      <path d="M22 2 15 22l-4-9-9-4z"></path>
    </svg>
  ),
};

/* =========================================================
   Header
   ========================================================= */
function Header({ route, navigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { id: "home", label: "Inicio" },
    { id: "grafica", label: "Gráfica" },
    { id: "cnc", label: "CNC" },
    { id: "carteleria", label: "Cartelería" },
  ];
  const go = (id) => {
    setMenuOpen(false);
    navigate(id);
  };
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand" onClick={() => go("home")}>
          <img className="brand-logo" src="assets/logo.jpg" alt="Colorcopy" />
          <div className="brand-text">COLORCOPY</div>
        </div>
        <nav className="nav">
          {links.map((l) => (
            <a
              key={l.id}
              className={"nav-link " + (route === l.id ? "active" : "")}
              onClick={() => navigate(l.id)}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="icon-btn" href="#" aria-label="Instagram" title="Instagram"><Icon.Instagram /></a>
          <a className="icon-btn" href="#" aria-label="Facebook" title="Facebook"><Icon.Facebook /></a>
        </div>
        <button
          className={"hamburger " + (menuOpen ? "is-open" : "")}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div className={"mobile-menu " + (menuOpen ? "is-open" : "")}>
        <div className="mobile-menu-inner">
          {links.map((l) => (
            <a
              key={l.id}
              className={"mobile-link " + (route === l.id ? "active" : "")}
              onClick={() => go(l.id)}
            >
              {l.label}
            </a>
          ))}
          <div className="mobile-social">
            <a className="icon-btn" href="#" aria-label="Instagram" title="Instagram"><Icon.Instagram /></a>
            <a className="icon-btn" href="#" aria-label="Facebook" title="Facebook"><Icon.Facebook /></a>
          </div>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   Hero
   ========================================================= */
function Hero() {
  const letters = "COLORCOPY".split("");
  return (
    <section className="hero">
      <div className="hero-center">
        <div className="hero-eyebrow">+27 años de experiencia — marketing tradicional &amp; digital</div>
        <h1 className="hero-title">
          {letters.map((l, i) => (
            <span key={i} className={"l-" + (i + 1)}>{l}</span>
          ))}
        </h1>
        <p className="hero-desc">
          Tres talleres, una misma obsesión por el color exacto. Imprimimos en
          gran formato, cortamos por CNC y montamos cartelería para que tu marca
          ocupe la calle como tiene que ocuparla.
        </p>
        <div className="hero-cta-row">
          <button className="btn-primary" onClick={() => window.openChat && window.openChat()}>
            Hacer un pedido
            <Icon.Robot width="26" height="26" />
          </button>
          <button
            className="btn-ghost"
            onClick={() => {
              const el = document.getElementById("que-hacemos");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            Ver catálogo
          </button>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Category banners
   ========================================================= */
const CATEGORIES = [
  {
    id: "grafica",
    name: "GRÁFICA",
    num: "01",
    color: "var(--red)",
    desc: "Impresión digital y offset, en cualquier escala.",
    tag: "Vinilo · Lona · Papel",
  },
  {
    id: "cnc",
    name: "CNC",
    num: "02",
    color: "var(--yellow)",
    desc: "Corte y ruteado de precisión sobre madera, acrílico, mdf.",
    tag: "Router · Láser · Plotter",
  },
  {
    id: "carteleria",
    name: "CARTELERÍA",
    num: "03",
    color: "var(--paint-blue)",
    desc: "Frentes, banderas, letras corpóreas e iluminación.",
    tag: "Indoor · Outdoor · LED",
  },
];

function CategorySection({ navigate }) {
  return (
    <section className="section" id="que-hacemos">
      <div className="section-head">
        <div>
          <div className="section-eyebrow">— Tres talleres, una mesa de trabajo</div>
          <h2 className="section-title">Qué hacemos <em>bien.</em></h2>
        </div>
        <p className="section-aside">
          Cada línea funciona como un taller independiente con su propio equipo,
          maquinaria y tiempo de entrega. Elegí la disciplina y empezamos.
        </p>
      </div>

      <div className="cat-list">
        {CATEGORIES.map((c) => (
          <div
            key={c.id}
            className="cat-card"
            style={{ "--cat-color": c.color }}
            onClick={() => navigate(c.id)}
          >
            <div className="cat-body">
              <div className="cat-name">{c.name}</div>
              <div className="cat-desc">{c.desc}</div>
            </div>
            <div className="cat-tag">{c.tag}</div>
            <div className="cat-arrow"><Icon.ArrowUpRight /></div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   Ticker strip
   ========================================================= */
function Ticker() {
  const items = (
    <span>
      <span className="strip-dot" style={{ background: "var(--red)" }}></span>
      Impresión en alta resolución
      <span className="strip-dot" style={{ background: "var(--yellow)" }}></span>
      Corte CNC milimétrico
      <span className="strip-dot" style={{ background: "var(--paint-blue)" }}></span>
      Cartelería iluminada
      <span className="strip-dot" style={{ background: "var(--navy)" }}></span>
      Diseño + producción
      <span className="strip-dot" style={{ background: "var(--red)" }}></span>
      Envíos a todo el país
    </span>
  );
  return (
    <div className="strip">
      <div className="strip-track">
        {items}{items}
      </div>
    </div>
  );
}

/* =========================================================
   Footer
   ========================================================= */
function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-mark">color<em>copy.</em></div>
          <p style={{ maxWidth: 320, color: "var(--muted)", marginTop: 18, fontSize: 14, lineHeight: 1.5 }}>
            Taller gráfico y de cartelería. Av. Siempre Viva 1234, CABA.
            Lun a Vie · 9–18 hs.
          </p>
        </div>
        <div className="footer-col">
          <h4>Servicios</h4>
          <ul>
            <li><a onClick={() => navigate("grafica")}>Gráfica</a></li>
            <li><a onClick={() => navigate("cnc")}>CNC</a></li>
            <li><a onClick={() => navigate("carteleria")}>Cartelería</a></li>
            <li><a>Diseño a medida</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Estudio</h4>
          <ul>
            <li><a>Nosotros</a></li>
            <li><a>Casos</a></li>
            <li><a>Clientes</a></li>
            <li><a>Trabajá con nosotros</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contacto</h4>
          <ul>
            <li><a>hola@colorcopy.com</a></li>
            <li><a>+54 11 4321-0000</a></li>
            <li><a>Instagram</a></li>
            <li><a>Facebook</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Colorcopy · Todos los derechos reservados</span>
        <span>★ Hecho con tinta en Buenos Aires</span>
      </div>
    </footer>
  );
}

/* expose to other scripts */
Object.assign(window, {
  Icon, Header, Hero, CategorySection, Ticker, Footer, CATEGORIES,
});
