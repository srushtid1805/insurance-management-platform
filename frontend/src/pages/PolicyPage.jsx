import "./PolicyPage.css";

import {
  FaSearch,
  FaFileContract,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import PolicyForm from "../components/policy/policyForm";

import {
  getPolicies,
  addPolicy,
  updatePolicy,
  deletePolicy
} from "../services/policyService";

function PolicyPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const [policies, setPolicies] = useState([]);

  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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

  // Debounce live search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch policies whenever search, filter, page or limit changes
  useEffect(() => {
    fetchPolicies();
  }, [debouncedSearch, status, page, limit]);

  // Fetch policies
  const fetchPolicies = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getPolicies(debouncedSearch, status, page, limit);

      setPolicies(result.data || []);

      setPagination(
        result.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalRecords: 0,
          limit
        }
      );
    } catch (error) {
      console.error("Error fetching policies:", error);

      const message =
        error.response?.data?.message || "Failed to fetch policies.";

      setPolicies([]);
      setError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Delete policy
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this policy?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deletePolicy(id);

      if (policies.length === 1 && page > 1) {
        setPage((previousPage) => previousPage - 1);
      } else {
        await fetchPolicies();
      }

      toast.success("Policy deleted successfully");
    } catch (error) {
      console.error(
        "Error deleting policy:",
        error.response?.data || error.message
      );

      toast.error(error.response?.data?.message || "Failed to delete policy.");
    }
  };

  // Edit policy
  const handleEdit = (policy) => {
    setSelectedPolicy(policy);
    setIsEditing(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Add policy
  const handleAddPolicy = async (policyData) => {
    try {
      await addPolicy(policyData);

      if (page !== 1) {
        setPage(1);
      } else {
        await fetchPolicies();
      }

      toast.success("Policy added successfully");
      return true;
    } catch (error) {
      console.error("Error adding policy:", error);

      toast.error(error.response?.data?.message || "Failed to add policy.");

      return false;
    }
  };

  // Update policy
  const handleUpdatePolicy = async (policyData) => {
    try {
      await updatePolicy(selectedPolicy.policy_id, policyData);

      setSelectedPolicy(null);
      setIsEditing(false);

      await fetchPolicies();

      toast.success("Policy updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating policy:", error);

      toast.error(error.response?.data?.message || "Failed to update policy.");

      return false;
    }
  };
  // Cancel edit
  const handleCancelEdit = () => {
    setSelectedPolicy(null);
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

  // Page number buttons
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
    <div className="policy-page">
      <div className="policy-page-header">
        <div>
          <p className="policy-page-eyebrow">Insurance Policies</p>

          <h1>Policy Management</h1>

          <p className="policy-page-subtitle">
            Create, update and manage insurance policies.
          </p>
        </div>

        <div className="policy-count-card">
          <div className="policy-count-icon">
            <FaFileContract />
          </div>

          <div>
            <small>Total Policies</small>
            <h3>{pagination.totalRecords}</h3>
          </div>
        </div>
      </div>

      {role === "admin" && (
        <section className="policy-section-card">
          <PolicyForm
            onAddPolicy={handleAddPolicy}
            onUpdatePolicy={handleUpdatePolicy}
            selectedPolicy={selectedPolicy}
            isEditing={isEditing}
            onCancelEdit={handleCancelEdit}
          />
        </section>
      )}

      <section className="policy-section-card policy-list-section">
        <div className="policy-toolbar">
          <div className="policy-search-wrapper">
            <FaSearch className="policy-search-icon" />

            <input
              type="search"
              className="form-control"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by policy name, type or description..."
              aria-label="Search policies"
            />
          </div>

          <div className="policy-status-wrapper">
            <label htmlFor="policy-status-filter">Status</label>

            <select
              id="policy-status-filter"
              className="form-select"
              value={status}
              onChange={handleStatusChange}
              disabled={loading}
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="policy-limit-wrapper">
            <label htmlFor="policy-limit">Records per page</label>

            <select
              id="policy-limit"
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

        {loading ? (
          <div className="policy-loading-state">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading policies...</span>
            </div>

            <p>Loading policies...</p>
          </div>
        ) : (
          <div className="table-responsive mt-4">
            <table className="table policy-table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Policy</th>
                  <th>Type</th>
                  <th>Premium</th>
                  <th>Coverage</th>
                  <th>Duration</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {policies.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="policy-empty-state">
                      {search || status
                        ? "No policies match your search or filter."
                        : "No policies found."}
                    </td>
                  </tr>
                ) : (
                  policies.map((policy) => (
                    <tr key={policy.policy_id}>
                      <td>
                        <span className="policy-id">#{policy.policy_id}</span>
                      </td>

                      <td>
                        <div className="policy-name-cell">
                          <div className="policy-icon">
                            <FaFileContract />
                          </div>

                          <span>{policy.policy_name}</span>
                        </div>
                      </td>

                      <td>{policy.policy_type}</td>

                      <td>
                        ₹
                        {Number(policy.premium_amount).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </td>

                      <td>
                        ₹
                        {Number(policy.coverage_amount).toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }
                        )}
                      </td>

                      <td>{policy.duration_months} Months</td>

                      <td className="policy-description-cell">
                        {policy.description || "-"}
                      </td>

                      <td>
                        <span
                          className={`policy-status-badge ${
                            policy.status === "Active"
                              ? "policy-status-active"
                              : "policy-status-inactive"
                          }`}
                        >
                          {policy.status === "Active" ? (
                            <FaCheckCircle />
                          ) : (
                            <FaTimesCircle />
                          )}

                          {policy.status}
                        </span>
                      </td>

                      <td>
                        {role === "admin" ? (
                          <div className="policy-actions">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleEdit(policy)}
                              disabled={loading}
                            >
                              <FaEdit />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(policy.policy_id)}
                              disabled={loading}
                            >
                              <FaTrash />
                              <span>Delete</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted">View only</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && pagination.totalRecords > 0 && (
          <div className="policy-pagination">
            <p>
              Page {pagination.currentPage} of {pagination.totalPages} | Total
              records: {pagination.totalRecords}
            </p>

            <div className="policy-pagination-buttons">
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
}

export default PolicyPage;
