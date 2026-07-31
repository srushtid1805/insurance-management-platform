import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

import HomePage from "./pages/HomePage";
import CustomerPage from "./pages/CustomerPage";
import PolicyPage from "./pages/PolicyPage";
import UserPolicyPage from "./pages/UserPolicyPage";
import PaymentPage from "./pages/PaymentPage";
import ClaimPage from "./pages/ClaimPage";
import DocumentPage from "./pages/DocumentPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";

function App() {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const isLoginPage = location.pathname === "/login";

  const getHomeRoute = () => {
    if (role === "admin") {
      return "/dashboard";
    }

    if (role === "agent") {
      return "/customers";
    }

    if (role === "customer") {
      return "/user-policies";
    }

    return "/login";
  };

  return (
    <>
      {!isLoginPage && token && <Navbar />}

      <Routes>
        <Route
          path="/login"
          element={
            token && user ? (
              <Navigate to={getHomeRoute()} replace />
            ) : (
              <LoginPage />
            )
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <DashboardPage />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <RoleProtectedRoute allowedRoles={["admin", "agent"]}>
              <CustomerPage />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/policies"
          element={
            <RoleProtectedRoute allowedRoles={["admin", "agent"]}>
              <PolicyPage />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/user-policies"
          element={
            <RoleProtectedRoute
              allowedRoles={["admin", "agent", "customer"]}
            >
              <UserPolicyPage />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <RoleProtectedRoute
              allowedRoles={["admin", "agent", "customer"]}
            >
              <PaymentPage />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/claims"
          element={
            <RoleProtectedRoute
              allowedRoles={["admin", "agent", "customer"]}
            >
              <ClaimPage />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/documents"
          element={
            <RoleProtectedRoute
              allowedRoles={["admin", "agent", "customer"]}
            >
              <DocumentPage />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to={token && user ? getHomeRoute() : "/login"}
              replace
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;