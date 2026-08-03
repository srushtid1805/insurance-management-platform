import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import HomePage from "./pages/HomePage";
import CustomerPage from "./pages/CustomerPage";
import PolicyPage from "./pages/PolicyPage";
import UserPolicyPage from "./pages/UserPolicyPage";
import PaymentPage from "./pages/PaymentPage";
import ClaimPage from "./pages/ClaimPage";
import DocumentPage from "./pages/DocumentPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import AgentDashboardPage from "./pages/AgentDashboardPage";

import CustomerDashboardPage from "./pages/CustomerDashboardPage";
import CustomerPoliciesPage from "./pages/CustomerPoliciesPage";
import CustomerPaymentsPage from "./pages/CustomerPaymentsPage";
import CustomerClaimsPage from "./pages/CustomerClaimsPage";
import CustomerDocumentsPage from "./pages/CustomerDocumentsPage";

const getAuthData = () => {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Invalid user data:", error);
  }

  return {
    token: localStorage.getItem("token"),
    user
  };
};

function App() {
  const [auth, setAuth] = useState(getAuthData);

  useEffect(() => {
    const handleAuthChange = () => {
      setAuth(getAuthData());
    };

    window.addEventListener("authChanged", handleAuthChange);

    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
    };
  }, []);

  const { token, user } = auth;
  const role = user?.role;

  const getHomeRoute = () => {
    if (role === "admin") {
      return "/dashboard";
    }

    if (role === "agent") {
      return "/agent-dashboard";
    }

    if (role === "customer") {
      return "/customer-dashboard";
    }

    return "/login";
  };

  return (
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
            <DashboardLayout>
              <HomePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/customers"
        element={
          <RoleProtectedRoute allowedRoles={["admin", "agent"]}>
            <DashboardLayout>
              <CustomerPage />
            </DashboardLayout>
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/policies"
        element={
          <RoleProtectedRoute allowedRoles={["admin", "agent"]}>
            <DashboardLayout>
              <PolicyPage />
            </DashboardLayout>
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/user-policies"
        element={
          <RoleProtectedRoute allowedRoles={["admin", "agent", "customer"]}>
            <DashboardLayout>
              <UserPolicyPage />
            </DashboardLayout>
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/payments"
        element={
          <RoleProtectedRoute allowedRoles={["admin", "agent", "customer"]}>
            <DashboardLayout>
              <PaymentPage />
            </DashboardLayout>
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/claims"
        element={
          <RoleProtectedRoute allowedRoles={["admin", "agent", "customer"]}>
            <DashboardLayout>
              <ClaimPage />
            </DashboardLayout>
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/documents"
        element={
          <RoleProtectedRoute allowedRoles={["admin", "agent", "customer"]}>
            <DashboardLayout>
              <DocumentPage />
            </DashboardLayout>
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/agent-dashboard"
        element={
          <RoleProtectedRoute allowedRoles={["agent"]}>
            <DashboardLayout>
              <AgentDashboardPage />
            </DashboardLayout>
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/customer-dashboard"
        element={
          <RoleProtectedRoute allowedRoles={["customer"]}>
            <DashboardLayout>
              <CustomerDashboardPage />
            </DashboardLayout>
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/my-policies"
        element={
          <RoleProtectedRoute allowedRoles={["customer"]}>
            <DashboardLayout>
              <CustomerPoliciesPage />
            </DashboardLayout>
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/my-payments"
        element={
          <RoleProtectedRoute allowedRoles={["customer"]}>
            <DashboardLayout>
              <CustomerPaymentsPage />
            </DashboardLayout>
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/my-claims"
        element={
          <RoleProtectedRoute allowedRoles={["customer"]}>
            <DashboardLayout>
              <CustomerClaimsPage />
            </DashboardLayout>
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/my-documents"
        element={
          <RoleProtectedRoute allowedRoles={["customer"]}>
            <DashboardLayout>
              <CustomerDocumentsPage />
            </DashboardLayout>
          </RoleProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <Navigate to={token && user ? getHomeRoute() : "/login"} replace />
        }
      />
    </Routes>
  );
}

export default App;
