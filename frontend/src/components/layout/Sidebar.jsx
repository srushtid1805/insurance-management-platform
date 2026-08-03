import { NavLink } from "react-router-dom";
import {
  FaChartPie,
  FaUsers,
  FaFileContract,
  FaLink,
  FaMoneyBillWave,
  FaClipboardList,
  FaFileAlt
} from "react-icons/fa";

function Sidebar({ closeSidebar }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const getLinkClass = ({ isActive }) =>
    `nav-link rounded px-3 py-2 ${
      isActive ? "bg-primary text-white" : "text-white"
    }`;

  return (
    <aside className="bg-dark text-white min-vh-100 p-3">
      <h4 className="mb-4">
        {role === "admin"
          ? "Insurance Admin"
          : role === "agent"
            ? "Insurance Agent"
            : "My Insurance"}
      </h4>

      <nav className="nav flex-column gap-2">
        {role === "admin" && (
          <NavLink
            to="/dashboard"
            className={getLinkClass}
            onClick={closeSidebar}
          >
            <FaChartPie className="me-2" />
            Dashboard
          </NavLink>
        )}

        {role === "agent" && (
          <NavLink
            to="/agent-dashboard"
            className={getLinkClass}
            onClick={closeSidebar}
          >
            <FaChartPie className="me-2" />
            Dashboard
          </NavLink>
        )}

        {role === "customer" && (
          <NavLink
            to="/customer-dashboard"
            className={getLinkClass}
            onClick={closeSidebar}
          >
            <FaChartPie className="me-2" />
            Dashboard
          </NavLink>
        )}

        {(role === "admin" || role === "agent") && (
          <>
            <NavLink
              to="/customers"
              className={getLinkClass}
              onClick={closeSidebar}
            >
              <FaUsers className="me-2" />
              Customers
            </NavLink>

            <NavLink
              to="/policies"
              className={getLinkClass}
              onClick={closeSidebar}
            >
              <FaFileContract className="me-2" />
              Policies
            </NavLink>
          </>
        )}

        <NavLink
          to={role === "customer" ? "/my-policies" : "/user-policies"}
          className={getLinkClass}
          onClick={closeSidebar}
        >
          <FaLink className="me-2" />
          {role === "customer" ? "My Policies" : "Assigned Policies"}
        </NavLink>

        <NavLink
          to={role === "customer" ? "/my-payments" : "/payments"}
          className={getLinkClass}
          onClick={closeSidebar}
        >
          <FaMoneyBillWave className="me-2" />
          {role === "customer" ? "My Payments" : "Payments"}
        </NavLink>

        <NavLink
          to={role === "customer" ? "/my-claims" : "/claims"}
          className={getLinkClass}
          onClick={closeSidebar}
        >
          <FaClipboardList className="me-2" />
          {role === "customer" ? "My Claims" : "Claims"}
        </NavLink>

        <NavLink
          to={role === "customer" ? "/my-documents" : "/documents"}
          className={getLinkClass}
          onClick={closeSidebar}
        >
          <FaFileAlt className="me-2" />
          {role === "customer" ? "My Documents" : "Documents"}
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
