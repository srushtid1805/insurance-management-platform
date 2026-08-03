import "./PaymentPageNew.css";

import {
  FaSearch,
  FaMoneyBillWave,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaTimesCircle
} from "react-icons/fa";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import PaymentForm from "../components/payments/paymentForm";

import {
  getAllPayments,
  createPayment,
  updatePayment,
  deletePayment
} from "../services/paymentService";

import { getUserPolicies } from "../services/userPolicyService";

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [userPolicies, setUserPolicies] = useState([]);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // Search, filter and pagination states
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 5
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch payments
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllPayments(
        debouncedSearch,
        status,
        page,
        limit
      );

      setPayments(response.data || []);

      setPagination(
        response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalRecords: 0,
          limit
        }
      );
    } catch (error) {
      console.error("Error fetching payments:", error);

      const message =
        error.response?.data?.message || "Failed to fetch payments";

      setPayments([]);
      setError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, page, limit]);

  // Fetch user policies for PaymentForm dropdown
  const fetchUserPolicies = async () => {
    try {
      const response = await getUserPolicies("", "", 1, 1000);

      // Supports the newer paginated response
      // and also protects against an older array response
      setUserPolicies(Array.isArray(response) ? response : response.data || []);
    } catch (error) {
      console.error("Error fetching user policies:", error);

      setUserPolicies([]);

      toast.error(
        error.response?.data?.message || "Failed to load user policies"
      );
    }
  };

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    fetchUserPolicies();
  }, []);

  // Add payment
  const handleAddPayment = async (paymentData) => {
    try {
      await createPayment(paymentData);

      if (page !== 1) {
        setPage(1);
      } else {
        await fetchPayments();
      }

      toast.success("Payment added successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add payment");

      throw error;
    }
  };

  // Start editing
  const handleEdit = (payment) => {
    setSelectedPayment(payment);
    setIsEditing(true);
  };

  // Update payment
  const handleUpdatePayment = async (paymentData) => {
    try {
      await updatePayment(selectedPayment.payment_id, paymentData);

      await fetchPayments();

      setSelectedPayment(null);
      setIsEditing(false);

      toast.success("Payment updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update payment");

      throw error;
    }
  };
  // Delete payment
  const handleDelete = async (paymentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this payment?"
    );

    if (!confirmDelete) return;

    try {
      await deletePayment(paymentId);

      if (payments.length === 1 && page > 1) {
        setPage((previousPage) => previousPage - 1);
      } else {
        await fetchPayments();
      }

      toast.success("Payment deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete payment");
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setSelectedPayment(null);
    setIsEditing(false);
  };

  // Status filter
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  // Records per page
  const handleLimitChange = (event) => {
    setLimit(Number(event.target.value));
    setPage(1);
  };

  // Pagination page numbers
  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (
      let pageNumber = 1;
      pageNumber <= pagination.totalPages;
      pageNumber++
    ) {
      pageNumbers.push(
        <button
          key={pageNumber}
          type="button"
          className={`btn btn-sm ${
            pageNumber === page ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setPage(pageNumber)}
          disabled={pageNumber === page || loading}
        >
          {pageNumber}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="payment-page">
      <div className="payment-page-header">
        <div>
          <p className="payment-page-eyebrow">Premium Transactions</p>

          <h1>Payment Management</h1>

          <p className="payment-page-subtitle">
            Record, track and manage customer premium payments.
          </p>
        </div>

        <div className="payment-count-card">
          <div className="payment-count-icon">
            <FaMoneyBillWave />
          </div>

          <div>
            <small>Total Payments</small>
            <h3>{pagination.totalRecords}</h3>
          </div>
        </div>
      </div>

      <section className="payment-section-card">
        {role === "admin" || role === "agent" ? (
          <PaymentForm
            onSubmit={
              isEditing && role === "admin"
                ? handleUpdatePayment
                : handleAddPayment
            }
            selectedPayment={role === "admin" ? selectedPayment : null}
            isEditing={role === "admin" ? isEditing : false}
            userPolicies={userPolicies}
          />
        ) : null}
        {role === "admin" && isEditing && (
          <div className="payment-cancel-wrapper">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleCancelEdit}
            >
              Cancel Edit
            </button>
          </div>
        )}
      </section>

      <section className="payment-section-card payment-list-section">
        <div className="payment-toolbar">
          <div className="payment-search-wrapper">
            <FaSearch className="payment-search-icon" />

            <input
              id="payment-search"
              type="search"
              className="form-control"
              placeholder="Search customer, policy, method or amount..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search payments"
            />
          </div>

          <div className="payment-status-wrapper">
            <label htmlFor="payment-status">Status</label>

            <select
              id="payment-status"
              className="form-select"
              value={status}
              onChange={handleStatusChange}
              disabled={loading}
            >
              <option value="">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div className="payment-limit-wrapper">
            <label htmlFor="payment-limit">Records per page</label>

            <select
              id="payment-limit"
              className="form-select"
              value={limit}
              onChange={handleLimitChange}
              disabled={loading}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <div className="payment-table-container">
          {loading && (
            <div className="payment-table-loading">
              <div
                className="spinner-border spinner-border-sm text-primary"
                role="status"
              >
                <span className="visually-hidden">Loading payments...</span>
              </div>

              <span>Loading records...</span>
            </div>
          )}

          <div className="table-responsive mt-4">
            <table className="table payment-table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Policy</th>
                  <th>Amount</th>
                  <th>Payment Date</th>
                  <th>Due Date</th>
                  <th>Method</th>
                  <th>Status</th>
                  {role === "admin" && <th className="text-center">Actions</th>}
                </tr>
              </thead>

              <tbody>
                {payments.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={role === "admin" ? 9 : 8} className="payment-empty-state">
                      {search || status
                        ? "No payments match your search or filter."
                        : "No payments found."}
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.payment_id}>
                      <td>
                        <span className="payment-id">
                          #{payment.payment_id}
                        </span>
                      </td>

                      <td>
                        <div className="payment-customer-cell">
                          <div className="payment-avatar">
                            {payment.full_name?.charAt(0).toUpperCase()}
                          </div>

                          <span>{payment.full_name}</span>
                        </div>
                      </td>

                      <td>{payment.policy_name}</td>

                      <td className="payment-amount">
                        ₹
                        {Number(payment.amount).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </td>

                      <td>
                        {payment.payment_date
                          ? new Date(payment.payment_date).toLocaleDateString(
                              "en-GB"
                            )
                          : "-"}
                      </td>

                      <td>
                        {payment.due_date
                          ? new Date(payment.due_date).toLocaleDateString(
                              "en-GB"
                            )
                          : "-"}
                      </td>

                      <td>
                        <span className="payment-method-badge">
                          {payment.payment_method}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`payment-status-badge ${
                            payment.payment_status === "Paid"
                              ? "payment-status-paid"
                              : payment.payment_status === "Pending"
                                ? "payment-status-pending"
                                : "payment-status-failed"
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

                      {role === "admin" && (
                        <td>
                          <div className="payment-actions">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleEdit(payment)}
                              disabled={loading}
                            >
                              <FaEdit />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(payment.payment_id)}
                              disabled={loading}
                            >
                              <FaTrash />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {pagination.totalRecords > 0 && (
          <div className="payment-pagination">
            <p>
              Page {pagination.currentPage} of {pagination.totalPages} | Total
              records: {pagination.totalRecords}
            </p>

            <div className="payment-pagination-buttons">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() =>
                  setPage((previousPage) => Math.max(previousPage - 1, 1))
                }
                disabled={page === 1 || loading}
              >
                Previous
              </button>

              {renderPageNumbers()}

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() =>
                  setPage((previousPage) =>
                    Math.min(previousPage + 1, pagination.totalPages)
                  )
                }
                disabled={page === pagination.totalPages || loading}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default PaymentPage;
