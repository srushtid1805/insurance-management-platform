import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";

function Topbar({ openSidebar }) {
  const navigate = useNavigate();

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Invalid user data:", error);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChanged"));

    navigate("/login", { replace: true });
  };

  return (
    <header className="bg-white border-bottom px-3 px-md-4 py-3 d-flex justify-content-between align-items-center sticky-top">
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="btn btn-outline-secondary d-lg-none"
          onClick={openSidebar}
          aria-label="Open navigation menu"
        >
          <FaBars />
        </button>

        <div>
          <h5 className="mb-0">
            Insurance Management System
          </h5>

          <small className="text-muted">
            Welcome, {user?.full_name || "User"} ({user?.role || "guest"})
          </small>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-outline-danger btn-sm"
        onClick={handleLogout}
      >
        Logout
      </button>
    </header>
  );
}

export default Topbar;