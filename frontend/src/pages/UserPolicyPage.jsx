import { useEffect, useState } from "react";
import UserPolicyForm from "../components/userPolicy/userPolicyForm";

import {
  getUserPolicies,
  deleteUserPolicy,
} from "../services/userPolicyService";

function UserPolicyPage() {
  const [userPolicies, setUserPolicies] = useState([]);
  const [selectedUserPolicy, setSelectedUserPolicy] =
    useState(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] =
    useState("");

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

  // Debounce live search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch data whenever filters or pagination change
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
          limit,
        }
      );
    } catch (error) {
      console.error("Error fetching user policies:", error);

      setUserPolicies([]);

      setError(
        error.response?.data?.message ||
          "Failed to fetch assigned policies."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (policy) => {
    setSelectedUserPolicy(policy);
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

      alert("Assigned policy deleted successfully!");
    } catch (error) {
      console.error("Error deleting user policy:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete assigned policy."
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
            pageNumber === page
              ? "btn-primary"
              : "btn-outline-primary"
          } me-1`}
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
    <div className="container mt-4">
      <UserPolicyForm
        fetchUserPolicies={handleFormSuccess}
        selectedUserPolicy={selectedUserPolicy}
        setSelectedUserPolicy={setSelectedUserPolicy}
      />

      <hr />

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <h2 className="mb-0">Assigned Policies</h2>

        <div className="d-flex flex-wrap gap-2">
          <input
            type="search"
            className="form-control"
            style={{ minWidth: "260px" }}
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search customer, email, policy, nominee..."
          />

          <select
            className="form-select"
            style={{ minWidth: "170px" }}
            value={status}
            onChange={handleStatusChange}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger mt-3">
          {error}
        </div>
      )}

      <div style={{ minHeight: "50px" }}>
        {loading && (
          <div className="alert alert-info mt-3 py-2">
            Loading assigned policies...
          </div>
        )}
      </div>

      <div className="table-responsive mt-3">
        <table className="table table-bordered table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Policy</th>
              <th>Policy Type</th>
              <th>Nominee</th>
              <th>Status</th>
              <th>Purchase Date</th>
              <th>Next Premium</th>
              <th>Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {userPolicies.length === 0 && !loading ? (
              <tr>
                <td
                  colSpan="11"
                  className="text-center"
                >
                  {search || status
                    ? "No assigned policies match your search or filter."
                    : "No assigned policies found."}
                </td>
              </tr>
            ) : (
              userPolicies.map((policy) => (
                <tr key={policy.id}>
                  <td>{policy.id}</td>

                  <td>{policy.customer_name}</td>

                  <td>{policy.email || "-"}</td>

                  <td>{policy.policy_name}</td>

                  <td>{policy.policy_type || "-"}</td>

                  <td>{policy.nominee_name || "-"}</td>

                  <td>{policy.policy_status}</td>

                  <td>
                    {policy.purchase_date
                      ? new Date(
                          policy.purchase_date
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>
                    {policy.next_premium_date
                      ? new Date(
                          policy.next_premium_date
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>
                    {policy.expiry_date
                      ? new Date(
                          policy.expiry_date
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>
                    <button
                      type="button"
                      className="btn btn-warning btn-sm me-2"
                      onClick={() =>
                        handleEdit(policy)
                      }
                      disabled={loading}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        handleDelete(policy.id)
                      }
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalRecords > 0 && (
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-3">
          <div>
            <label
              htmlFor="user-policy-limit"
              className="me-2"
            >
              Records per page:
            </label>

            <select
              id="user-policy-limit"
              value={limit}
              onChange={handleLimitChange}
              disabled={loading}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>

          <p className="mb-0">
            Page {pagination.currentPage} of{" "}
            {pagination.totalPages} | Total records:{" "}
            {pagination.totalRecords}
          </p>

          <div>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm me-2"
              onClick={() =>
                setPage((previousPage) =>
                  Math.max(previousPage - 1, 1)
                )
              }
              disabled={page === 1 || loading}
            >
              Previous
            </button>

            {renderPageNumbers()}

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm ms-1"
              onClick={() =>
                setPage((previousPage) =>
                  Math.min(
                    previousPage + 1,
                    pagination.totalPages
                  )
                )
              }
              disabled={
                page === pagination.totalPages ||
                loading
              }
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserPolicyPage;