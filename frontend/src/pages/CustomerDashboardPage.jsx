import "./CustomerDashboardPage.css";

import { useEffect, useState } from "react";
import {
  FaFileContract,
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
  FaClipboardList,
  FaFolderOpen,
  FaCalendarAlt,
  FaUser
} from "react-icons/fa";

import DashboardCard from "../components/DashboardCard";
import { getCustomerDashboard } from "../services/customerDashboardService";

const CustomerDashboardPage = () => {
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [nextPremium, setNextPremium] = useState(null);
  const [recentPolicies, setRecentPolicies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomerDashboard();
  }, []);

  const fetchCustomerDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCustomerDashboard();
      const dashboardData = response.data || {};

      setProfile(dashboardData.profile || null);
      setSummary(dashboardData.summary || null);
      setNextPremium(dashboardData.next_premium || null);
      setRecentPolicies(dashboardData.recent_policies || []);
    } catch (error) {
      console.error("Error loading customer dashboard:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load customer dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-GB");
  };

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">
            Loading customer dashboard...
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
    <div className="customer-dashboard-page">
      <div className="customer-dashboard-header">
        <div>
          <p className="customer-dashboard-eyebrow">
            My Insurance Overview
          </p>

          <h1>
            Welcome, {profile?.full_name || "Customer"}
          </h1>

          <p className="customer-dashboard-subtitle">
            View your policies, payments, claims and documents.
          </p>
        </div>
      </div>

      <section className="customer-profile-card">
        <div className="customer-profile-icon">
          <FaUser />
        </div>

        <div className="customer-profile-details">
          <h2>{profile?.full_name || "-"}</h2>

          <div className="customer-profile-grid">
            <p>
              <strong>Email:</strong> {profile?.email || "-"}
            </p>

            <p>
              <strong>Phone:</strong> {profile?.phone || "-"}
            </p>

            <p>
              <strong>Address:</strong> {profile?.address || "-"}
            </p>

            <p>
              <strong>Date of Birth:</strong>{" "}
              {formatDate(profile?.date_of_birth)}
            </p>
          </div>
        </div>
      </section>

      <div className="customer-dashboard-grid">
        <DashboardCard
          title="Total Policies"
          value={summary?.total_policies ?? 0}
          icon={<FaFileContract />}
          color="#7c3aed"
        />

        <DashboardCard
          title="Active Policies"
          value={summary?.active_policies ?? 0}
          icon={<FaCheckCircle />}
          color="#16a34a"
        />

        <DashboardCard
          title="Expired Policies"
          value={summary?.expired_policies ?? 0}
          icon={<FaTimesCircle />}
          color="#dc2626"
        />

        <DashboardCard
          title="Total Payments"
          value={summary?.total_payments ?? 0}
          icon={<FaMoneyBillWave />}
          color="#10b981"
        />

        <DashboardCard
          title="Pending Payments"
          value={summary?.pending_payments ?? 0}
          icon={<FaCalendarAlt />}
          color="#f59e0b"
        />

        <DashboardCard
          title="Total Claims"
          value={summary?.total_claims ?? 0}
          icon={<FaClipboardList />}
          color="#2563eb"
        />

        <DashboardCard
          title="Pending Claims"
          value={summary?.pending_claims ?? 0}
          icon={<FaClipboardList />}
          color="#f97316"
        />

        <DashboardCard
          title="My Documents"
          value={summary?.total_documents ?? 0}
          icon={<FaFolderOpen />}
          color="#0ea5e9"
        />
      </div>

      <section className="customer-dashboard-section-card">
        <div className="customer-dashboard-section-header">
          <div>
            <p className="customer-dashboard-section-eyebrow">
              Upcoming Payment
            </p>

            <h2>Next Premium</h2>
          </div>
        </div>

        {nextPremium ? (
          <div className="next-premium-card">
            <div>
              <p className="next-premium-label">
                Policy
              </p>

              <h3>{nextPremium.policy_name}</h3>
            </div>

            <div>
              <p className="next-premium-label">
                Premium Amount
              </p>

              <strong>
                {formatCurrency(nextPremium.premium_amount)}
              </strong>
            </div>

            <div>
              <p className="next-premium-label">
                Due Date
              </p>

              <strong>
                {formatDate(nextPremium.next_premium_date)}
              </strong>
            </div>
          </div>
        ) : (
          <div className="customer-dashboard-empty-state">
            No upcoming premium is available.
          </div>
        )}
      </section>

      <section className="customer-dashboard-section-card">
        <div className="customer-dashboard-section-header">
          <div>
            <p className="customer-dashboard-section-eyebrow">
              Policy Records
            </p>

            <h2>Recent Policies</h2>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table customer-policy-table align-middle">
            <thead>
              <tr>
                <th>Policy</th>
                <th>Type</th>
                <th>Premium</th>
                <th>Coverage</th>
                <th>Status</th>
                <th>Purchase Date</th>
                <th>Expiry Date</th>
              </tr>
            </thead>

            <tbody>
              {recentPolicies.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="customer-dashboard-empty-state"
                  >
                    No policies are assigned to your account.
                  </td>
                </tr>
              ) : (
                recentPolicies.map((policy) => (
                  <tr key={policy.id}>
                    <td>{policy.policy_name}</td>
                    <td>{policy.policy_type}</td>
                    <td>
                      {formatCurrency(policy.premium_amount)}
                    </td>
                    <td>
                      {formatCurrency(policy.coverage_amount)}
                    </td>

                    <td>
                      <span
                        className={`customer-policy-status ${
                          policy.policy_status === "Active"
                            ? "customer-policy-status-active"
                            : policy.policy_status === "Expired"
                              ? "customer-policy-status-expired"
                              : "customer-policy-status-cancelled"
                        }`}
                      >
                        {policy.policy_status}
                      </span>
                    </td>

                    <td>{formatDate(policy.purchase_date)}</td>
                    <td>{formatDate(policy.expiry_date)}</td>
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

export default CustomerDashboardPage;