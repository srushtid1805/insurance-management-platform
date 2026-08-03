import "./CustomerPaymentsPage.css";

import { useEffect, useState } from "react";
import {
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaTimesCircle
} from "react-icons/fa";

import {
  getCustomerPayments
} from "../services/customerDashboardService";

const CustomerPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCustomerPayments();

      setPayments(response.data || []);
    } catch (error) {
      console.error("Error loading customer payments:", error);

      setPayments([]);

      setError(
        error.response?.data?.message ||
          "Failed to load your payments."
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
            Loading payments...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-payments-page">
      <div className="customer-payments-header">
        <div>
          <p className="customer-payments-eyebrow">
            Payment History
          </p>

          <h1>My Payments</h1>

          <p className="customer-payments-subtitle">
            View your premium payment records and their current status.
          </p>
        </div>

        <div className="customer-payments-count-card">
          <div className="customer-payments-count-icon">
            <FaMoneyBillWave />
          </div>

          <div>
            <small>Total Payments</small>
            <h3>{payments.length}</h3>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <section className="customer-payments-section-card">
        <div className="table-responsive">
          <table className="table customer-payments-table align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Policy</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Payment Date</th>
                <th>Due Date</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="customer-payments-empty-state"
                  >
                    No payment records are available.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.payment_id}>
                    <td>#{payment.payment_id}</td>
                    <td>{payment.policy_name || "-"}</td>
                    <td>{payment.policy_type || "-"}</td>

                    <td className="customer-payment-amount">
                      {formatCurrency(payment.amount)}
                    </td>

                    <td>{formatDate(payment.payment_date)}</td>
                    <td>{formatDate(payment.due_date)}</td>
                    <td>{payment.payment_method || "-"}</td>

                    <td>
                      <span
                        className={`customer-payment-status ${
                          payment.payment_status === "Paid"
                            ? "customer-payment-status-paid"
                            : payment.payment_status === "Pending"
                              ? "customer-payment-status-pending"
                              : "customer-payment-status-failed"
                        }`}
                      >
                        {payment.payment_status === "Paid" ? (
                          <FaCheckCircle />
                        ) : payment.payment_status === "Pending" ? (
                          <FaClock />
                        ) : (
                          <FaTimesCircle />
                        )}

                        {payment.payment_status}
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

export default CustomerPaymentsPage;