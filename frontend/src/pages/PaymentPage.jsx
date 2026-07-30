import { useCallback, useEffect, useState } from "react";
import PaymentForm from "../components/payments/PaymentForm";

import {
  getAllPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from "../services/paymentService";

import { getUserPolicies } from "../services/userPolicyService";

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [userPolicies, setUserPolicies] = useState([]);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
    limit: 5,
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
          limit,
        }
      );
    } catch (error) {
      console.error("Error fetching payments:", error);

      setPayments([]);
      setError(
        error.response?.data?.message || "Failed to fetch payments"
      );
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
      setUserPolicies(
        Array.isArray(response) ? response : response.data || []
      );
    } catch (error) {
      console.error("Error fetching user policies:", error);
      setUserPolicies([]);
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

      setPage(1);

      // If already on page 1, refresh immediately
      if (page === 1) {
        await fetchPayments();
      }

      alert("Payment added successfully");
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to add payment"
      );

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
      await updatePayment(
        selectedPayment.payment_id,
        paymentData
      );

      await fetchPayments();

      setSelectedPayment(null);
      setIsEditing(false);

      alert("Payment updated successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update payment"
      );

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

      /*
        If this was the only record on the current page,
        move to the previous page.
      */
      if (payments.length === 1 && page > 1) {
        setPage((previousPage) => previousPage - 1);
      } else {
        await fetchPayments();
      }

      alert("Payment deleted successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete payment"
      );
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
    <div>
      <h1>Payment Management</h1>

      <PaymentForm
        onSubmit={
          isEditing
            ? handleUpdatePayment
            : handleAddPayment
        }
        selectedPayment={selectedPayment}
        isEditing={isEditing}
        userPolicies={userPolicies}
      />

      {isEditing && (
        <button type="button" onClick={handleCancelEdit}>
          Cancel Edit
        </button>
      )}

      <h2>Payment List</h2>

      {/* Search */}
      <div>
        <label htmlFor="payment-search">
          Search Payments:
        </label>

        <input
          id="payment-search"
          type="text"
          placeholder="Search customer, policy, method or amount"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {/* Status filter */}
      <div>
        <label htmlFor="payment-status">
          Filter by Status:
        </label>

        <select
          id="payment-status"
          value={status}
          onChange={handleStatusChange}
        >
          <option value="">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {/* Records per page */}
      <div>
        <label htmlFor="payment-limit">
          Records per page:
        </label>

        <select
          id="payment-limit"
          value={limit}
          onChange={handleLimitChange}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>

      {error && <p>{error}</p>}

      {loading && <p>Loading payments...</p>}

      <table border="1">
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
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {!loading && payments.length === 0 ? (
            <tr>
              <td colSpan="9">
                No payments found
              </td>
            </tr>
          ) : (
            payments.map((payment) => (
              <tr key={payment.payment_id}>
                <td>{payment.payment_id}</td>

                <td>{payment.full_name}</td>

                <td>{payment.policy_name}</td>

                <td>{payment.amount}</td>

                <td>
                  {payment.payment_date
                    ? payment.payment_date.split("T")[0]
                    : ""}
                </td>

                <td>
                  {payment.due_date
                    ? payment.due_date.split("T")[0]
                    : ""}
                </td>

                <td>{payment.payment_method}</td>

                <td>{payment.payment_status}</td>

                <td>
                  <button
                    type="button"
                    onClick={() => handleEdit(payment)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(payment.payment_id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination remains mounted during loading */}
      {pagination.totalRecords > 0 && (
        <div>
          <p>
            Showing page {pagination.currentPage} of{" "}
            {pagination.totalPages} — Total records:{" "}
            {pagination.totalRecords}
          </p>

          <button
            type="button"
            onClick={() =>
              setPage((previousPage) => previousPage - 1)
            }
            disabled={page === 1 || loading}
          >
            Previous
          </button>

          {renderPageNumbers()}

          <button
            type="button"
            onClick={() =>
              setPage((previousPage) => previousPage + 1)
            }
            disabled={
              page === pagination.totalPages || loading
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;