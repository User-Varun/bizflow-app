import { createBrowserRouter, Outlet } from "react-router";
import { RouterProvider } from "react-router/dom";

import { Navbar } from "./features/ui/navbar";
import { Dashboard } from "./features/dashBoard/Dashboard";
import { Inventory } from "./features/inventory/Inventory";
import { ProductCatalog } from "./features/productCatalog/ProductCatalog";
import { GenerateBill } from "./features/generateBill/GenerateBill";
// import { InvoiceFormat } from "./features/generateBill/invoiceFormat";

function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, Component: Dashboard },
      { path: "inventory", element: <Inventory /> },
      { path: "productCatalog", element: <ProductCatalog /> },
      { path: "generateBill", element: <GenerateBill /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
