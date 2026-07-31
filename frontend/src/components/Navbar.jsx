import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const userName = user?.full_name || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <NavLink
          className="navbar-brand"
          to={
            role === "admin"
              ? "/dashboard"
              : role === "agent"
              ? "/customers"
              : "/user-policies"
          }
        >
          Insurance Management
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#insuranceNavbar"
          aria-controls="insuranceNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="insuranceNavbar"
        >
          <div className="navbar-nav me-auto">
            {role === "admin" && (
              <>
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
              </>
            )}

            {role === "agent" && (
              <>
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
              </>
            )}

            {role === "customer" && (
              <>
                <NavLink className="nav-link" to="/user-policies">
                  My Policies
                </NavLink>

                <NavLink className="nav-link" to="/payments">
                  My Payments
                </NavLink>

                <NavLink className="nav-link" to="/claims">
                  My Claims
                </NavLink>

                <NavLink className="nav-link" to="/documents">
                  My Documents
                </NavLink>
              </>
            )}
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="text-light">
              Welcome, {userName} ({role})
            </span>

            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;