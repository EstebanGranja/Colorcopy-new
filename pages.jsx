/* global React, Icon, CATEGORIES */
const { useState: useStateP } = React;

/* PRODUCTS vive en data/catalog.js (single source of truth para front + backend).
   Lo leemos de window — data/catalog.js carga antes que este script. */
const PRODUCTS = window.PRODUCTS || {};


/* =========================================================
   Home page
   ========================================================= */
function HomePage({ navigate }) {
  return (
    <div className="page">
      <Hero />
      <Ticker />
      <CategorySection navigate={navigate} />
    </div>
  );
}

/* =========================================================
   Category page
   ========================================================= */
function CategoryPage({ id, navigate }) {
  const cat = CATEGORIES.find((c) => c.id === id);
  const data = PRODUCTS[id];
  const [filter, setFilter] = useStateP("Todos");
  if (!cat || !data) return null;

  return (
    <div className="page cat-page">
      <section className="cat-hero">
        <div className="cat-hero-inner">
          <div>
            <div className="crumb">
              <a onClick={() => navigate("home")}>Inicio</a>
              <span>/</span>
              <span style={{ color: "var(--paper)" }}>{cat.name}</span>
            </div>
            <h1 className="cat-title">{cat.name}</h1>
          </div>
          <div className="cat-intro">
            <p style={{ margin: 0 }}>{data.intro}</p>
          </div>
        </div>
      </section>

      <div className="toolbar">
        <div className="filters">
          {data.filters.map((f) => (
            <button
              key={f}
              className={"chip " + (filter === f ? "active" : "")}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="tool-right">
          <span>{data.items.length} productos</span>
          <span>· Ordenar por relevancia ↓</span>
        </div>
      </div>

      <div className="products">
        {data.items.map((p, i) => (
          <ProductCard key={p.name} product={p} index={i} catColor={cat.color} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, index, catColor }) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <article className="product">
      <div className="product-media">
        <div className="product-num">N° {num}</div>
        {product.tag && (
          <div className={"product-tag " + (product.tagClass || "")}>{product.tag}</div>
        )}
        <div className="product-media-label">[ producto · imagen ]</div>
        <button className="product-hover-btn">
          Agregar a pedido
          <Icon.Arrow />
        </button>
      </div>
      <div className="product-info">
        <div>
          <div className="product-name">{product.name}</div>
          <div className="product-meta">{product.meta}</div>
        </div>
        <div className="product-price">
          {product.price}
          <small>{product.unit}</small>
        </div>
      </div>
    </article>
  );
}

Object.assign(window, { HomePage, CategoryPage });
