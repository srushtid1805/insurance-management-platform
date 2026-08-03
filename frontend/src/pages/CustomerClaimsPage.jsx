import "./CustomerClaimsPage.css";

import { useEffect, useState } from "react";
import {
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaTimesCircle
} from "react-icons/fa";

import {
  getCustomerClaims
} from "../services/customerDashboardService";

const CustomerClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCustomerClaims();

      setClaims(response.data || []);
    } catch (error) {
      console.error("Error loading customer claims:", error);

      setClaims([]);

      setError(
        error.response?.data?.message ||
          "Failed to load your claims."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date
      ? new Date(date).toLocaleDateString("en-GB")
      : "-";
  };

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">
            Loading claims...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-claims-page">
      <div className="customer-claims-header">
        <div>
          <p className="customer-claims-eyebrow">
            Claim History
          </p>

          <h1>My Claims</h1>

          <p className="customer-claims-subtitle">
            View your submitted insurance claims and their status.
          </p>
        </div>

        <div className="customer-claims-count-card">
          <div className="customer-claims-count-icon">
            <FaClipboardList />
          </div>

          <div>
            <small>Total Claims</small>
            <h3>{claims.length}</h3>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <section className="customer-claims-section-card">
        <div className="table-responsive">
          <table className="table customer-claims-table align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Policy</th>
                <th>Type</th>
                <th>Claim Amount</th>
                <th>Reason</th>
                <th>Claim Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {claims.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="customer-claims-empty-state"
                  >
                    No claim records are available.
                  </td>
                </tr>
              ) : (
                claims.map((claim) => (
                  <tr key={claim.claim_id}>
                    <td>#{claim.claim_id}</td>
                    <td>{claim.policy_name || "-"}</td>
                    <td>{claim.policy_type || "-"}</td>

                    <td className="customer-claim-amount">
                      {formatCurrency(claim.claim_amount)}
                    </td>

                    <td className="customer-claim-reason">
                      {claim.claim_reason || "-"}
                    </td>

                    <td>{formatDate(claim.claim_date)}</td>

                    <td>
                      <span
                        className={`customer-claim-status ${
                          claim.claim_status === "Approved"
                            ? "customer-claim-status-approved"
                            : claim.claim_status === "Pending"
                              ? "customer-claim-status-pending"
                              : "customer-claim-status-rejected"
                        }`}
                      >
                        {claim.claim_status === "Approved" ? (
                          <FaCheckCircle />
                        ) : claim.claim_status === "Pending" ? (
                          <FaClock />
                        ) : (
                          <FaTimesCircle />
                        )}

                        {claim.claim_status}
                      </span>
                    </td>
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

export default CustomerClaimsPage;