/* =========================================================
   Colorcopy — catalog (single source of truth)
   Dual export: window.PRODUCTS in browser, module.exports in Node.
   ========================================================= */
const CATALOG = {
  grafica: {
    color: "var(--red)",
    intro: "Imprimimos sobre vinilo, lona, papel y tela. Tirajes desde 1 unidad, calibración de color en obra y entrega lista para colgar.",
    filters: ["Todos", "Vinilo", "Lona", "Papel", "Tela", "Stickers"],
    items: [
      {
        id: "vinilo-adhesivo",
        name: "Vinilo adhesivo", meta: "Brillante · Mate", price: "$ 4.800", unit: "por m²", tag: "Top", tagClass: "red",
        variations: {
          terminacion: { label: "Terminación", type: "enum", options: ["Brillante", "Mate"] },
          superficie:  { label: "Superficie",  type: "number", unit: "m²", min: 0.5 },
        },
      },
      {
        id: "lona-frontlit",
        name: "Lona front-lit", meta: "Solvente · 440g", price: "$ 6.200", unit: "por m²",
        variations: {
          superficie: { label: "Superficie", type: "number", unit: "m²", min: 1 },
          ojales:     { label: "Ojales",     type: "enum",   options: ["Sin ojales", "Cada 50 cm", "Cada 1 m"] },
        },
      },
      {
        id: "papel-ilustracion",
        name: "Papel ilustración", meta: "150g · A3+", price: "$ 1.480", unit: "por unidad",
        variations: {
          gramaje:  { label: "Gramaje",  type: "enum", options: ["115g", "150g", "200g"] },
          tamano:   { label: "Tamaño",   type: "enum", options: ["A4", "A3", "A3+"] },
          cantidad: { label: "Cantidad", type: "number", min: 1 },
        },
      },
      {
        id: "banderas-rollup",
        name: "Banderas roll-up", meta: "85×200 cm", price: "$ 38.000", unit: "kit completo", tag: "Nuevo", tagClass: "yellow",
        variations: {
          medida:   { label: "Medida",   type: "enum", options: ["85×200 cm", "100×200 cm"] },
          cantidad: { label: "Cantidad", type: "number", min: 1 },
        },
      },
      {
        id: "stickers-troquelados",
        name: "Stickers troquelados", meta: "Vinilo blanco", price: "$ 690", unit: "x 100 u.",
        variations: {
          forma:     { label: "Forma del troquel", type: "enum",   options: ["Circular", "Cuadrado", "Personalizado"] },
          tamano_cm: { label: "Tamaño máximo",     type: "number", unit: "cm", min: 2, max: 20 },
          cantidad:  { label: "Cantidad",          type: "number", min: 50 },
        },
      },
      {
        id: "calcos-vehiculares",
        name: "Calcos vehiculares", meta: "Cast 3M · 7 años", price: "$ 12.400", unit: "por m²",
        variations: {
          superficie: { label: "Superficie", type: "number", unit: "m²", min: 0.3 },
          laminado:   { label: "Laminado UV", type: "enum",   options: ["Con laminado", "Sin laminado"] },
        },
      },
    ],
  },
  cnc: {
    color: "var(--yellow)",
    intro: "Router CNC y láser para corte y grabado milimétrico. Trabajamos sobre madera, mdf, acrílico, pvc y aluminio composite.",
    filters: ["Todos", "Madera", "Acrílico", "MDF", "Aluminio", "Láser"],
    items: [
      {
        id: "letras-corporeas",
        name: "Letras corpóreas", meta: "MDF · 18 mm", price: "$ 9.800", unit: "por letra", tag: "Top", tagClass: "yellow",
        variations: {
          material:    { label: "Material",     type: "enum",   options: ["MDF 18 mm", "Acrílico 10 mm", "PVC 5 mm"] },
          alto_cm:     { label: "Alto",         type: "number", unit: "cm", min: 5, max: 200 },
          texto:       { label: "Texto/letra",  type: "text" },
          terminacion: { label: "Terminación",  type: "enum",   options: ["Crudo", "Pintado", "Laminado"] },
        },
      },
      {
        id: "display-mostrador",
        name: "Display de mostrador", meta: "Acrílico 5 mm", price: "$ 14.500", unit: "unidad",
        variations: {
          tamano:   { label: "Tamaño",   type: "enum",   options: ["Chico (A5)", "Mediano (A4)", "Grande (A3)"] },
          cantidad: { label: "Cantidad", type: "number", min: 1 },
        },
      },
      {
        id: "logo-acrilico",
        name: "Logo en acrílico", meta: "Doble capa pulida", price: "$ 22.000", unit: "unidad",
        variations: {
          ancho_cm: { label: "Ancho",   type: "number", unit: "cm", min: 10, max: 200 },
          colores:  { label: "Colores", type: "text" },
          archivo:  { label: "Archivo del logo", type: "text" },
        },
      },
      {
        id: "grabado-laser-madera",
        name: "Grabado láser madera", meta: "Pino · Roble", price: "$ 3.200", unit: "por dm²",
        variations: {
          madera:        { label: "Tipo de madera", type: "enum",   options: ["Pino", "Roble", "MDF"] },
          superficie_dm: { label: "Superficie",     type: "number", unit: "dm²", min: 1 },
        },
      },
      {
        id: "plantilla-cnc",
        name: "Plantilla CNC", meta: "Personalizada", price: "$ 8.600", unit: "unidad", tag: "Custom", tagClass: "blue",
        variations: {
          material: { label: "Material", type: "enum",   options: ["MDF", "Acrílico", "PVC"] },
          medidas:  { label: "Medidas (alto×ancho cm)", type: "text" },
          cantidad: { label: "Cantidad", type: "number", min: 1 },
        },
      },
      {
        id: "maqueta-arquitectura",
        name: "Maqueta arquitectura", meta: "MDF + acrílico", price: "$ 64.000", unit: "desde",
        variations: {
          escala:    { label: "Escala",        type: "enum", options: ["1:50", "1:100", "1:200"] },
          materiales:{ label: "Materiales",    type: "text" },
          plano:     { label: "Plano/archivo", type: "text" },
        },
      },
    ],
  },
  carteleria: {
    color: "var(--paint-blue)",
    intro: "Diseño, fabricación e instalación. Carteles indoor y outdoor, frentes iluminados y banderas para vidriera.",
    filters: ["Todos", "Frente", "LED", "Bandera", "Tótem", "Indoor"],
    items: [
      {
        id: "cartel-frente-local",
        name: "Cartel frente local", meta: "Composite + vinilo", price: "$ 185.000", unit: "desde 2×0,8 m", tag: "Pro", tagClass: "blue",
        variations: {
          ancho_m:    { label: "Ancho",   type: "number", unit: "m", min: 1 },
          alto_m:     { label: "Alto",    type: "number", unit: "m", min: 0.4 },
          iluminado:  { label: "Iluminado", type: "enum",  options: ["Sin iluminación", "LED frontal", "LED retroiluminado"] },
          ubicacion:  { label: "Ubicación / dirección", type: "text" },
        },
      },
      {
        id: "letras-corporeas-led",
        name: "Letras corpóreas LED", meta: "Iluminación interna", price: "$ 24.800", unit: "por letra",
        variations: {
          alto_cm: { label: "Alto", type: "number", unit: "cm", min: 10, max: 150 },
          texto:   { label: "Texto", type: "text" },
          color:   { label: "Color del LED", type: "enum", options: ["Blanco cálido", "Blanco frío", "RGB"] },
        },
      },
      {
        id: "totem-direccional",
        name: "Tótem direccional", meta: "Chapa + impresión", price: "$ 240.000", unit: "unidad",
        variations: {
          alto_m:   { label: "Alto",     type: "number", unit: "m", min: 1, max: 4 },
          caras:    { label: "Caras impresas", type: "enum",   options: ["1 cara", "2 caras"] },
          cantidad: { label: "Cantidad", type: "number", min: 1 },
        },
      },
      {
        id: "bandera-vidriera",
        name: "Bandera vidriera", meta: "Vinilo · Inst. incl.", price: "$ 32.000", unit: "por unidad",
        variations: {
          medidas_cm: { label: "Medidas (alto×ancho cm)", type: "text" },
          cantidad:   { label: "Cantidad", type: "number", min: 1 },
        },
      },
      {
        id: "banner-stand-outdoor",
        name: "Banner stand outdoor", meta: "Estructura + lona", price: "$ 58.000", unit: "kit",
        variations: {
          medida:   { label: "Medida",   type: "enum",   options: ["2×1 m", "3×1.5 m", "4×2 m"] },
          cantidad: { label: "Cantidad", type: "number", min: 1 },
        },
      },
      {
        id: "vinilo-decorativo",
        name: "Vinilo decorativo", meta: "Pared u oficina", price: "$ 8.400", unit: "por m²",
        variations: {
          superficie:    { label: "Superficie", type: "number", unit: "m²", min: 0.5 },
          tipo:          { label: "Tipo",       type: "enum",   options: ["Texturado", "Liso", "Microperforado"] },
          instalacion:   { label: "Instalación", type: "enum",  options: ["Con instalación", "Solo material"] },
        },
      },
    ],
  },
};

if (typeof window !== "undefined") window.PRODUCTS = CATALOG;
if (typeof module !== "undefined" && module.exports) module.exports = CATALOG;
