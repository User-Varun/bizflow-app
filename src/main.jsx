import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Navbar } from "./components/layouts/navbar";
import { Dashboard } from "./components/pages/Dashboard";
import { Inventory } from "./components/pages/Inventory";
import { ProductCatalog } from "./components/pages/ProductCatalog";
import { GenerateBill } from "./components/pages/GenerateBill";
import { Routes } from "./components/routes";

const App = function () {
  const [page, setPage] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPage(window.location.pathname);

    window.addEventListener("popstate", onPopState);

    return () => window.addEventListener("popstate", onPopState);
  }, []);

  const navigate = function (path) {
    window.history.pushState({}, "", path);
    setPage(path);
  };

  return (
    <>
      <Navbar navigate={navigate} />
      {page === Routes.DashBoard && <Dashboard />}
      {page === Routes.Inventory && <Inventory />}
      {page === Routes.ProductCatalog && <ProductCatalog />}
      {page === Routes.GenerateBill && <GenerateBill />}
    </>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
