import "./UserPolicyPage.css";

import {
  FaSearch,
  FaLink,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaBan
} from "react-icons/fa";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import UserPolicyForm from "../components/userPolicy/userPolicyForm";

import {
  getUserPolicies,
  deleteUserPolicy
} from "../services/userPolicyService";

function UserPolicyPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const [userPolicies, setUserPolicies] = useState([]);
  const [selectedUserPolicy, setSelectedUserPolicy] = useState(null);

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

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch whenever search, status, page or limit changes
  useEffect(() => {
    fetchUserPolicies();
  }, [debouncedSearch, status, page, limit]);

  const fetchUserPolicies = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getUserPolicies(
        debouncedSearch,
        status,
        page,
        limit
      );

      setUserPolicies(result.data || []);

      setPagination(
        result.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalRecords: 0,
          limit
        }
      );
    } catch (error) {
      console.error("Error fetching user policies:", error);

      const message =
        error.response?.data?.message || "Failed to fetch assigned policies.";

      setUserPolicies([]);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (policy) => {
    setSelectedUserPolicy(policy);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this assigned policy?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteUserPolicy(id);

      if (userPolicies.length === 1 && page > 1) {
        setPage((previousPage) => previousPage - 1);
      } else {
        await fetchUserPolicies();
      }

      toast.success("Assigned policy deleted successfully");
    } catch (error) {
      console.error("Error deleting user policy:", error);

      toast.error(
        error.response?.data?.message || "Failed to delete assigned policy."
      );
    }
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  const handleLimitChange = (event) => {
    setLimit(Number(event.target.value));
    setPage(1);
  };

  const handleFormSuccess = async () => {
    setSelectedUserPolicy(null);

    if (page !== 1) {
      setPage(1);
    } else {
      await fetchUserPolicies();
    }
  };

  const renderPageNumbers = () => {
    const pageButtons = [];

    for (
      let pageNumber = 1;
      pageNumber <= pagination.totalPages;
      pageNumber++
    ) {
      pageButtons.push(
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

    return pageButtons;
  };

  return (
    <div className="user-policy-page">
      <div className="user-policy-page-header">
        <div>
          <p className="user-policy-page-eyebrow">Policy Assignments</p>

          <h1>Assigned Policies</h1>

          <p className="user-policy-page-subtitle">
            Assign policies to customers and manage their coverage details.
          </p>
        </div>

        <div className="user-policy-count-card">
          <div className="user-policy-count-icon">
            <FaLink />
          </div>

          <div>
            <small>Total Assignments</small>
            <h3>{pagination.totalRecords}</h3>
          </div>
        </div>
      </div>

      <section className="user-policy-section-card">
        {(role === "admin" || role === "agent") && (
          <UserPolicyForm
            fetchUserPolicies={handleFormSuccess}
            selectedUserPolicy={selectedUserPolicy}
            setSelectedUserPolicy={setSelectedUserPolicy}
          />
        )}
      </section>

      <section className="user-policy-section-card user-policy-list-section">
        <div className="user-policy-toolbar">
          <div className="user-policy-search-wrapper">
            <FaSearch className="user-policy-search-icon" />

            <input
              type="search"
              className="form-control"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customer, email, policy or nominee..."
              aria-label="Search assigned policies"
            />
          </div>

          <div className="user-policy-status-wrapper">
            <label htmlFor="user-policy-status-filter">Status</label>

            <select
              id="user-policy-status-filter"
              className="form-select"
              value={status}
              onChange={handleStatusChange}
              disabled={loading}
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="user-policy-limit-wrapper">
            <label htmlFor="user-policy-limit">Records per page</label>

            <select
              id="user-policy-limit"
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

        <div className="user-policy-table-container">
          {loading && (
            <div className="user-policy-table-loading">
              <div
                className="spinner-border spinner-border-sm text-primary"
                role="status"
              >
                <span className="visually-hidden">
                  Loading assigned policies...
                </span>
              </div>

              <span>Loading records...</span>
            </div>
          )}

          <div className="table-responsive mt-4">
            <table className="table user-policy-table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Policy</th>
                  <th>Type</th>
                  <th>Nominee</th>
                  <th>Status</th>
                  <th>Purchase Date</th>
                  <th>Next Premium</th>
                  <th>Expiry Date</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {userPolicies.length === 0 && !loading ? (
                  <tr>
                    <td colSpan="11" className="user-policy-empty-state">
                      {search || status
                        ? "No assigned policies match your search or filter."
                        : "No assigned policies found."}
                    </td>
                  </tr>
                ) : (
                  userPolicies.map((policy) => (
                    <tr key={policy.id}>
                      <td>
                        <span className="user-policy-id">#{policy.id}</span>
                      </td>

                      <td>
                        <div className="user-policy-customer-cell">
                          <div className="user-policy-avatar">
                            {policy.customer_name?.charAt(0).toUpperCase()}
                          </div>

                          <span>{policy.customer_name}</span>
                        </div>
                      </td>

                      <td>{policy.email || "-"}</td>
                      <td>{policy.policy_name}</td>
                      <td>{policy.policy_type || "-"}</td>
                      <td>{policy.nominee_name || "-"}</td>

                      <td>
                        <span
                          className={`user-policy-status-badge ${
                            policy.policy_status === "Active"
                              ? "user-policy-status-active"
                              : policy.policy_status === "Expired"
                                ? "user-policy-status-expired"
                                : "user-policy-status-cancelled"
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

                      <td>
                        {policy.purchase_date
                          ? new Date(policy.purchase_date).toLocaleDateString(
                              "en-GB"
                            )
                          : "-"}
                      </td>

                      <td>
                        {policy.next_premium_date
                          ? new Date(
                              policy.next_premium_date
                            ).toLocaleDateString("en-GB")
                          : "-"}
                      </td>

                      <td>
                        {policy.expiry_date
                          ? new Date(policy.expiry_date).toLocaleDateString(
                              "en-GB"
                            )
                          : "-"}
                      </td>

                      <td>
                        {role === "admin" ? (
                          <div className="user-policy-actions">
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
                              onClick={() => handleDelete(policy.id)}
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
        </div>

        {pagination.totalRecords > 0 && (
          <div className="user-policy-pagination">
            <p>
              Page {pagination.currentPage} of {pagination.totalPages} | Total
              records: {pagination.totalRecords}
            </p>

            <div className="user-policy-pagination-buttons">
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

export default UserPolicyPage;
