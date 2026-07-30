import { useCallback, useEffect, useState } from "react";
import ClaimForm from "../components/claims/ClaimForm";

import {
  getAllClaims,
  createClaim,
  updateClaim,
  deleteClaim,
} from "../services/claimService";

import { getUserPolicies } from "../services/userPolicyService";

const ClaimPage = () => {
  const [claims, setClaims] = useState([]);
  const [userPolicies, setUserPolicies] = useState([]);

  const [selectedClaim, setSelectedClaim] = useState(null);
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

  const fetchClaims = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllClaims(
        debouncedSearch,
        status,
        page,
        limit
      );

      setClaims(response.data || []);

      setPagination(
        response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalRecords: 0,
          limit,
        }
      );
    } catch (error) {
      console.error("Error fetching claims:", error);

      setClaims([]);
      setError(
        error.response?.data?.message || "Failed to fetch claims"
      );
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, page, limit]);

  const fetchUserPolicies = async () => {
    try {
      const response = await getUserPolicies("", "", 1, 1000);

      setUserPolicies(
        Array.isArray(response)
          ? response
          : response.data || []
      );
    } catch (error) {
      console.error("Error fetching user policies:", error);
      setUserPolicies([]);
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

      setPage(1);

      if (page === 1) {
        await fetchClaims();
      }

      alert("Claim added successfully");
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to add claim"
      );

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

      alert("Claim updated successfully");
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to update claim"
      );

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

      alert("Claim deleted successfully");
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to delete claim"
      );
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
      <h1>Claim Management</h1>

      <ClaimForm
        onSubmit={isEditing ? handleUpdateClaim : handleAddClaim}
        selectedClaim={selectedClaim}
        isEditing={isEditing}
        userPolicies={userPolicies}
      />

      {isEditing && (
        <button type="button" onClick={handleCancelEdit}>
          Cancel Edit
        </button>
      )}

      <h2>Claim List</h2>

      <div>
        <label htmlFor="claim-search">Search Claims:</label>

        <input
          id="claim-search"
          type="text"
          placeholder="Search customer, policy, reason or amount"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="claim-status">
          Filter by Status:
        </label>

        <select
          id="claim-status"
          value={status}
          onChange={handleStatusChange}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div>
        <label htmlFor="claim-limit">
          Records per page:
        </label>

        <select
          id="claim-limit"
          value={limit}
          onChange={handleLimitChange}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>

      {error && <p>{error}</p>}

      {loading && <p>Loading claims...</p>}

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Policy</th>
            <th>Claim Amount</th>
            <th>Reason</th>
            <th>Claim Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {!loading && claims.length === 0 ? (
            <tr>
              <td colSpan="8">No claims found</td>
            </tr>
          ) : (
            claims.map((claim) => (
              <tr key={claim.claim_id}>
                <td>{claim.claim_id}</td>
                <td>{claim.full_name}</td>
                <td>{claim.policy_name}</td>
                <td>{claim.claim_amount}</td>
                <td>{claim.claim_reason}</td>

                <td>
                  {claim.claim_date
                    ? claim.claim_date.split("T")[0]
                    : ""}
                </td>

                <td>{claim.claim_status}</td>

                <td>
                  <button
                    type="button"
                    onClick={() => handleEdit(claim)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(claim.claim_id)
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

export default ClaimPage;