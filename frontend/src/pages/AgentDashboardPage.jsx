import "./AgentDashboardPage.css";

import { useEffect, useState } from "react";
import {
  FaUsers,
  FaFileContract,
  FaMoneyBillWave,
  FaClipboardList,
  FaFolderOpen
} from "react-icons/fa";

import DashboardCard from "../components/DashboardCard";
import { getAgentDashboard } from "../services/agentDashboardService";

const AgentDashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAgentDashboard();
  }, []);

  const fetchAgentDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAgentDashboard();

      setSummary(response.data?.summary || null);
      setRecentCustomers(response.data?.recent_customers || []);
    } catch (error) {
      console.error("Error loading agent dashboard:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load agent dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">
            Loading agent dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="agent-dashboard-page">
      <div className="agent-dashboard-header">
        <div>
          <p className="agent-dashboard-eyebrow">
            Agent Overview
          </p>

          <h1>Agent Dashboard</h1>

          <p className="agent-dashboard-subtitle">
            Monitor your assigned customers, policies, payments and claims.
          </p>
        </div>
      </div>

      <div className="agent-dashboard-grid">
        <DashboardCard
          title="My Customers"
          value={summary?.total_customers ?? 0}
          icon={<FaUsers />}
          color="#2563eb"
        />

        <DashboardCard
          title="Assigned Policies"
          value={summary?.total_assigned_policies ?? 0}
          icon={<FaFileContract />}
          color="#7c3aed"
        />

        <DashboardCard
          title="Pending Payments"
          value={summary?.pending_payments ?? 0}
          icon={<FaMoneyBillWave />}
          color="#f59e0b"
        />

        <DashboardCard
          title="Pending Claims"
          value={summary?.pending_claims ?? 0}
          icon={<FaClipboardList />}
          color="#dc2626"
        />

        <DashboardCard
          title="Pending Documents"
          value={summary?.pending_documents ?? 0}
          icon={<FaFolderOpen />}
          color="#0ea5e9"
        />
      </div>

      <section className="agent-dashboard-card">
        <div className="agent-dashboard-section-header">
          <div>
            <p className="agent-dashboard-section-eyebrow">
              Recent Records
            </p>

            <h2>My Customers</h2>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table agent-customer-table align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
              </tr>
            </thead>

            <tbody>
              {recentCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="agent-dashboard-empty-state"
                  >
                    No customers are assigned to this agent.
                  </td>
                </tr>
              ) : (
                recentCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>#{customer.id}</td>

                    <td>
                      <div className="agent-customer-cell">
                        <div className="agent-customer-avatar">
                          {customer.full_name
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <span>{customer.full_name}</span>
                      </div>
                    </td>

                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.address || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AgentDashboardPage;