import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          Insurance Management
        </NavLink>

        <div className="navbar-nav">
          <NavLink className="nav-link" to="/">
            Home
          </NavLink>

          <NavLink className="nav-link" to="/dashboard">
            Dashboard
          </NavLink>

          <NavLink className="nav-link" to="/customers">
            Customers
          </NavLink>

          <NavLink className="nav-link" to="/policies">
            Policies
          </NavLink>

          <NavLink className="nav-link" to="/user-policies">
            User Policies
          </NavLink>

          <NavLink className="nav-link" to="/payments">
            Payments
          </NavLink>

          <NavLink className="nav-link" to="/claims">
            Claims
          </NavLink>

          <NavLink className="nav-link" to="/documents">
            Documents
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
