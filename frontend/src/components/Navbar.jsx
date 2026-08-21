import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  function isActive(path) {
    return location.pathname === path
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-blue-600";
  }

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="flex gap-6">
        <Link to="/" className={isActive("/")}>
          Dashboard
        </Link>
        <Link to="/tickets" className={isActive("/tickets")}>
          Tickets
        </Link>
        <Link to="/agents" className={isActive("/agents")}>
          Agents
        </Link>
        <Link to="/customers" className={isActive("/customers")}>
          Customers
        </Link>
      </div>
      {location.pathname === "/" && (
        <Link
          to="/tickets/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          + New Ticket
        </Link>
      )}
    </nav>
  );
}

export default Navbar;
