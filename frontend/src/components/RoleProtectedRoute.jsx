import { Navigate } from "react-router-dom";

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "customer") {
      return <Navigate to="/user-policies" replace />;
    }

    if (user.role === "agent") {
      return <Navigate to="/customers" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleProtectedRoute;