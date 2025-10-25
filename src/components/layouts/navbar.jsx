import { Routes } from "../routes";
import "../styles/navbar.css";

export function Navbar({ navigate }) {
  return (
    <nav id="nav">
      <a href="#" id="nav-logo">
        BizFlow
      </a>

      <ul id="nav-ul">
        <li className="list-item" onClick={() => navigate(Routes.DashBoard)}>
          DashBoard
        </li>

        <li className="list-item" onClick={() => navigate(Routes.Inventory)}>
          Inventory
        </li>

        <li
          className="list-item"
          onClick={() => navigate(Routes.ProductCatalog)}
        >
          Product Catalog
        </li>

        <li className="list-item" onClick={() => navigate(Routes.GenerateBill)}>
          Generate Bill
        </li>
      </ul>
    </nav>
  );
}
