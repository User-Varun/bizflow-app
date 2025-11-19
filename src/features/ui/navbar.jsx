import { Link, NavLink } from "react-router";
import "../styles/navbar.css";

export function Navbar() {
  // const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <nav id="nav">
      <a href="#" id="nav-logo">
        BizFlow
      </a>

      <ul id="nav-ul">
        <NavLink
          className="list-item "
          style={({ isActive }) =>
            isActive
              ? { backgroundColor: "#5c3b23e6", color: "#fff" }
              : { color: "black" }
          }
          to="/"
        >
          🏠 DashBoard
        </NavLink>
        <NavLink
          style={({ isActive }) =>
            isActive
              ? { backgroundColor: "#5c3b23e6", color: "#fff" }
              : { color: "black" }
          }
          className="list-item"
          to="/inventory"
        >
          📦 Inventory
        </NavLink>
        <NavLink
          style={({ isActive }) =>
            isActive
              ? { backgroundColor: "#5c3b23e6", color: "#fff !important" }
              : { color: "black" }
          }
          className="list-item"
          to="/productCatalog"
        >
          🗺️ ProductCatalog
        </NavLink>
        <NavLink
          style={({ isActive }) =>
            isActive
              ? { backgroundColor: "#5c3b23e6", color: "#fff" }
              : { color: "black" }
          }
          className="list-item"
          to="/GenerateBill"
        >
          📃 Generate Bill
        </NavLink>
      </ul>
    </nav>
  );
}
