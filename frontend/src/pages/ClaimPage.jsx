import "./ClaimPage.css";

import {
  FaSearch,
  FaClipboardList,
  FaEdit,
  FaTrash,
  FaClock,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";

import { useCallback, useEffect, useState } from "react";
import ClaimForm from "../components/claims/ClaimForm";
import { toast } from "react-toastify";

import {
  getAllClaims,
  createClaim,
  updateClaim,
  deleteClaim
} from "../services/claimService";

import { getUserPolicies } from "../services/userPolicyService";

const ClaimPage = () => {
  const [claims, setClaims] = useState([]);
  const [userPolicies, setUserPolicies] = useState([]);

  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

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

  const fetchClaims = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllClaims(debouncedSearch, status, page, limit);

      setClaims(response.data || []);

      setPagination(
        response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalRecords: 0,
          limit
        }
      );
    } catch (error) {
      console.error("Error fetching claims:", error);

      const message = error.response?.data?.message || "Failed to fetch claims";

      setClaims([]);
      setError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, page, limit]);

  const fetchUserPolicies = async () => {
    try {
      const response = await getUserPolicies("", "", 1, 1000);

      setUserPolicies(Array.isArray(response) ? response : response.data || []);
    } catch (error) {
      console.error("Error fetching user policies:", error);

      setUserPolicies([]);

      toast.error(
        error.response?.data?.message || "Failed to load user policies"
      );
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  useEffect(() => {
    fetchUserPolicies();
  }, []);

  const handleAddClaim = async (claimData) => {
    try {
      await createClaim(claimData);

      if (page !== 1) {
        setPage(1);
      } else {
        await fetchClaims();
      }

      toast.success("Claim added successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add claim");

      throw error;
    }
  };

  const handleEdit = (claim) => {
    setSelectedClaim(claim);
    setIsEditing(true);
  };

  const handleUpdateClaim = async (claimData) => {
    try {
      await updateClaim(selectedClaim.claim_id, claimData);
      await fetchClaims();

      setSelectedClaim(null);
      setIsEditing(false);

      toast.success("Claim updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update claim");

      throw error;
    }
  };

  const handleDelete = async (claimId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this claim?"
    );

    if (!confirmDelete) return;

    try {
      await deleteClaim(claimId);

      if (claims.length === 1 && page > 1) {
        setPage((previousPage) => previousPage - 1);
      } else {
        await fetchClaims();
      }

      toast.success("Claim deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete claim");
    }
  };

  const handleCancelEdit = () => {
    setSelectedClaim(null);
    setIsEditing(false);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  const handleLimitChange = (event) => {
    setLimit(Number(event.target.value));
    setPage(1);
  };

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
    <div className="claim-page">
      <div className="claim-page-header">
        <div>
          <p className="claim-page-eyebrow">Insurance Claims</p>

          <h1>Claim Management</h1>

          <p className="claim-page-subtitle">
            Create, review and manage insurance claim records.
          </p>
        </div>

        <div className="claim-count-card">
          <div className="claim-count-icon">
            <FaClipboardList />
          </div>

          <div>
            <small>Total Claims</small>
            <h3>{pagination.totalRecords}</h3>
          </div>
        </div>
      </div>

      <section className="claim-section-card">
        {role === "admin" || role === "agent" ? (
          <ClaimForm
            onSubmit={
              isEditing && role === "admin" ? handleUpdateClaim : handleAddClaim
            }
            selectedClaim={role === "admin" ? selectedClaim : null}
            isEditing={role === "admin" ? isEditing : false}
            userPolicies={userPolicies}
          />
        ) : null}

        {role === "admin" && isEditing && (
          <div className="claim-cancel-wrapper">
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

      <section className="claim-section-card claim-list-section">
        <div className="claim-toolbar">
          <div className="claim-search-wrapper">
            <FaSearch className="claim-search-icon" />

            <input
              id="claim-search"
              type="search"
              className="form-control"
              placeholder="Search customer, policy, reason or amount..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search claims"
            />
          </div>

          <div className="claim-status-wrapper">
            <label htmlFor="claim-status">Status</label>

            <select
              id="claim-status"
              className="form-select"
              value={status}
              onChange={handleStatusChange}
              disabled={loading}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="claim-limit-wrapper">
            <label htmlFor="claim-limit">Records per page</label>

            <select
              id="claim-limit"
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

        <div className="claim-table-container">
          {loading && (
            <div className="claim-table-loading">
              <div
                className="spinner-border spinner-border-sm text-primary"
                role="status"
              >
                <span className="visually-hidden">Loading claims...</span>
              </div>

              <span>Loading records...</span>
            </div>
          )}

          <div className="table-responsive mt-4">
            <table className="table claim-table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Policy</th>
                  <th>Claim Amount</th>
                  <th>Reason</th>
                  <th>Claim Date</th>
                  <th>Status</th>
                  {role === "admin" && <th className="text-center">Actions</th>}
                </tr>
              </thead>

              <tbody>
                {claims.length === 0 && !loading ? (
                  <tr>
                    <td
                      colSpan={role === "admin" ? 8 : 7}
                      className="claim-empty-state"
                    >
                      {search || status
                        ? "No claims match your search or filter."
                        : "No claims found."}
                    </td>
                  </tr>
                ) : (
                  claims.map((claim) => (
                    <tr key={claim.claim_id}>
                      <td>
                        <span className="claim-id">#{claim.claim_id}</span>
                      </td>

                      <td>
                        <div className="claim-customer-cell">
                          <div className="claim-avatar">
                            {claim.full_name?.charAt(0).toUpperCase()}
                          </div>

                          <span>{claim.full_name}</span>
                        </div>
                      </td>

                      <td>{claim.policy_name}</td>

                      <td className="claim-amount">
                        ₹
                        {Number(claim.claim_amount).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </td>

                      <td className="claim-reason-cell">
                        {claim.claim_reason || "-"}
                      </td>

                      <td>
                        {claim.claim_date
                          ? new Date(claim.claim_date).toLocaleDateString(
                              "en-GB"
                            )
                          : "-"}
                      </td>

                      <td>
                        <span
                          className={`claim-status-badge ${
                            claim.claim_status === "Approved"
                              ? "claim-status-approved"
                              : claim.claim_status === "Pending"
                                ? "claim-status-pending"
                                : "claim-status-rejected"
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

                      {role === "admin" && (
                        <td>
                          <div className="claim-actions">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleEdit(claim)}
                              disabled={loading}
                            >
                              <FaEdit />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(claim.claim_id)}
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
          <div className="claim-pagination">
            <p>
              Page {pagination.currentPage} of {pagination.totalPages} | Total
              records: {pagination.totalRecords}
            </p>

            <div className="claim-pagination-buttons">
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

export default ClaimPage;
