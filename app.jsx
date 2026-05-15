/* global React, ReactDOM, Header, Footer, Chatbot, HomePage, CategoryPage */
const { useState, useEffect } = React;

const VALID = new Set(["home", "grafica", "cnc", "carteleria"]);

function parseHash() {
  const h = (window.location.hash || "#/").replace(/^#\/?/, "");
  const id = h || "home";
  return VALID.has(id) ? id : "home";
}

function App() {
  const [route, setRoute] = useState(parseHash());

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [route]);

  const navigate = (id) => {
    window.location.hash = id === "home" ? "/" : "/" + id;
  };

  let page;
  if (route === "home") {
    page = <HomePage navigate={navigate} />;
  } else {
    page = <CategoryPage id={route} navigate={navigate} />;
  }

  return (
    <div data-screen-label={"00 " + route}>
      <Header route={route} navigate={navigate} />
      {page}
      <Footer navigate={navigate} />
      <Chatbot />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
