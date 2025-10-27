import { Link } from "react-router";
import "../styles/navbar.css";

export function Navbar() {
  return (
    <nav id="nav">
      <a href="#" id="nav-logo">
        BizFlow
      </a>

      <ul id="nav-ul">
        <Link className="list-item" to="/">
          DashBoard
        </Link>
        <Link className="list-item" to="/inventory">
          Inventory
        </Link>
        <Link className="list-item" to="/productCatalog">
          ProductCatalog
        </Link>
        <Link className="list-item" to="/GenerateBill">
          Generate Bill
        </Link>
      </ul>
    </nav>
  );
}
