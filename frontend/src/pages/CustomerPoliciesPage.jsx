import "./CustomerPoliciesPage.css";

import { useEffect, useState } from "react";
import {
  FaFileContract,
  FaCheckCircle,
  FaTimesCircle,
  FaBan
} from "react-icons/fa";

import { getCustomerPolicies } from "../services/customerDashboardService";

const CustomerPoliciesPage = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCustomerPolicies();

      setPolicies(response.data || []);
    } catch (error) {
      console.error("Error loading customer policies:", error);

      setPolicies([]);

      setError(
        error.response?.data?.message ||
          "Failed to load your policies."
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
            Loading your policies...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-policies-page">
      <div className="customer-policies-header">
        <div>
          <p className="customer-policies-eyebrow">
            My Insurance
          </p>

          <h1>My Policies</h1>

          <p className="customer-policies-subtitle">
            View all insurance policies assigned to your account.
          </p>
        </div>

        <div className="customer-policies-count-card">
          <div className="customer-policies-count-icon">
            <FaFileContract />
          </div>

          <div>
            <small>Total Policies</small>
            <h3>{policies.length}</h3>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <section className="customer-policies-section-card">
        <div className="table-responsive">
          <table className="table customer-policies-table align-middle">
            <thead>
              <tr>
                <th>Policy</th>
                <th>Type</th>
                <th>Premium</th>
                <th>Coverage</th>
                <th>Nominee</th>
                <th>Status</th>
                <th>Purchase Date</th>
                <th>Next Premium</th>
                <th>Expiry Date</th>
              </tr>
            </thead>

            <tbody>
              {policies.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="customer-policies-empty-state"
                  >
                    No policies are assigned to your account.
                  </td>
                </tr>
              ) : (
                policies.map((policy) => (
                  <tr key={policy.id}>
                    <td>
                      <div className="customer-policy-name-cell">
                        <div className="customer-policy-icon">
                          <FaFileContract />
                        </div>

                        <span>{policy.policy_name}</span>
                      </div>
                    </td>

                    <td>{policy.policy_type || "-"}</td>

                    <td>
                      {formatCurrency(policy.premium_amount)}
                    </td>

                    <td>
                      {formatCurrency(policy.coverage_amount)}
                    </td>

                    <td>{policy.nominee_name || "-"}</td>

                    <td>
                      <span
                        className={`customer-policy-status-badge ${
                          policy.policy_status === "Active"
                            ? "customer-policy-status-active"
                            : policy.policy_status === "Expired"
                              ? "customer-policy-status-expired"
                              : "customer-policy-status-cancelled"
                        }`}
                      >
                        {policy.policy_status === "Active" ? (
                          <FaCheckCircle />
                        ) : policy.policy_status === "Expired" ? (
                          <FaTimesCircle />
                        ) : (
                          <FaBan />
                        )}

                        {policy.policy_status}
                      </span>
                    </td>

                    <td>{formatDate(policy.purchase_date)}</td>
                    <td>{formatDate(policy.next_premium_date)}</td>
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

export default CustomerPoliciesPage;