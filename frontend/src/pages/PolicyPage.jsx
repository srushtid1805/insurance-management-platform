import { useEffect, useState } from "react";
import PolicyForm from "../components/policy/policyForm";

import {
  getPolicies,
  addPolicy,
  updatePolicy,
  deletePolicy,
} from "../services/policyService";

function PolicyPage() {
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

  // Fetch policies whenever search, filter, page or limit changes
  useEffect(() => {
    fetchPolicies();
  }, [debouncedSearch, status, page, limit]);

  // Fetch policies
  const fetchPolicies = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getPolicies(
        debouncedSearch,
        status,
        page,
        limit
      );

      setPolicies(result.data || []);

      setPagination(
        result.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalRecords: 0,
          limit,
        }
      );
    } catch (error) {
      console.error(error);

      setPolicies([]);
      setError(
        error.response?.data?.message ||
          "Failed to fetch policies."
      );
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

      // If the last record on the current page is deleted,
      // move to the previous page.
      if (policies.length === 1 && page > 1) {
        setPage((previousPage) => previousPage - 1);
      } else {
        await fetchPolicies();
      }

      alert("Policy Deleted Successfully!");
    } catch (error) {
      console.error(error.response?.data || error.message);

      alert(
        error.response?.data?.message ||
          "Failed to delete policy."
      );
    }
  };

  // Edit policy
  const handleEdit = (policy) => {
    setSelectedPolicy(policy);
    setIsEditing(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Add policy
  const handleAddPolicy = async (policyData) => {
    try {
      await addPolicy(policyData);

      setPage(1);

      if (page === 1) {
        await fetchPolicies();
      }

      alert("Policy Added Successfully!");
      return true;
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to add policy."
      );

      return false;
    }
  };

  // Update policy
  const handleUpdatePolicy = async (policyData) => {
    try {
      await updatePolicy(
        selectedPolicy.policy_id,
        policyData
      );

      setSelectedPolicy(null);
      setIsEditing(false);

      await fetchPolicies();

      alert("Policy Updated Successfully!");
      return true;
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to update policy."
      );

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
          onClick={() => setPage(pageNumber)}
          disabled={pageNumber === page}
        >
          {pageNumber}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div>
      <h1>Insurance Management System</h1>

      <hr />

      <h2>Policy Management</h2>

      <PolicyForm
        onAddPolicy={handleAddPolicy}
        onUpdatePolicy={handleUpdatePolicy}
        selectedPolicy={selectedPolicy}
        isEditing={isEditing}
        onCancelEdit={handleCancelEdit}
      />

      <hr />

      <div>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by policy name, type or description..."
        />

        <select
          value={status}
          onChange={handleStatusChange}
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <br />

      {error && <p>{error}</p>}

      {loading ? (
        <p>Loading policies...</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Policy Name</th>
              <th>Policy Type</th>
              <th>Premium</th>
              <th>Coverage</th>
              <th>Duration</th>
              <th>Description</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {policies.length === 0 ? (
              <tr>
                <td colSpan="9">
                  {search || status
                    ? "No policies match your search or filter."
                    : "No policies found."}
                </td>
              </tr>
            ) : (
              policies.map((policy) => (
                <tr key={policy.policy_id}>
                  <td>{policy.policy_id}</td>
                  <td>{policy.policy_name}</td>
                  <td>{policy.policy_type}</td>
                  <td>₹{policy.premium_amount}</td>
                  <td>₹{policy.coverage_amount}</td>
                  <td>{policy.duration_months} Months</td>
                  <td>{policy.description || "-"}</td>
                  <td>{policy.status}</td>

                  <td>
                    <button
                      type="button"
                      onClick={() => handleEdit(policy)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(policy.policy_id)
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
      )}

      {!loading && pagination.totalRecords > 0 && (
        <div>
          <br />

          <div>
            <label htmlFor="policy-limit">
              Records per page:{" "}
            </label>

            <select
              id="policy-limit"
              value={limit}
              onChange={handleLimitChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>

          <p>
            Showing page {pagination.currentPage} of{" "}
            {pagination.totalPages} — Total records:{" "}
            {pagination.totalRecords}
          </p>

          <div>
            <button
              type="button"
              onClick={() =>
                setPage((previousPage) =>
                  Math.max(previousPage - 1, 1)
                )
              }
              disabled={page === 1}
            >
              Previous
            </button>

            {renderPageNumbers()}

            <button
              type="button"
              onClick={() =>
                setPage((previousPage) =>
                  Math.min(
                    previousPage + 1,
                    pagination.totalPages
                  )
                )
              }
              disabled={
                page === pagination.totalPages
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

export default PolicyPage;