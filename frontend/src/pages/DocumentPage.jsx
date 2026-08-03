import "./DocumentPage.css";

import {
  FaSearch,
  FaFileAlt,
  FaEdit,
  FaTrash,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExternalLinkAlt
} from "react-icons/fa";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import DocumentForm from "../components/documents/DocumentForm";

import {
  getAllDocuments,
  createDocument,
  updateDocument,
  deleteDocument
} from "../services/documentService";

import { getCustomers } from "../services/customerService";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const DocumentPage = () => {
  const [documents, setDocuments] = useState([]);
  const [users, setUsers] = useState([]);

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  // Search, Filter & Pagination
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

  // Fetch Documents
  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllDocuments(
        debouncedSearch,
        status,
        page,
        limit
      );

      setDocuments(response.data || []);

      setPagination(
        response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalRecords: 0,
          limit
        }
      );
    } catch (error) {
      console.error("Error fetching documents:", error);

      const message =
        error.response?.data?.message || "Failed to fetch documents";

      setDocuments([]);
      setError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, page, limit]);

  // Fetch Customers
  const fetchUsers = async () => {
    try {
      const response = await getCustomers("", 1, 1000);

      setUsers(
        Array.isArray(response)
          ? response
          : response.customers || response.data || []
      );
    } catch (error) {
      console.error("Error fetching customers:", error);

      setUsers([]);

      toast.error(error.response?.data?.message || "Failed to load customers");
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
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add
  const handleAddDocument = async (formData) => {
    try {
      await createDocument(formData);

      if (page !== 1) {
        setPage(1);
      } else {
        await fetchDocuments();
      }

      toast.success("Document uploaded successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload document");

      throw error;
    }
  };

  // Edit
  const handleEdit = (document) => {
    setSelectedDocument(document);
    setIsEditing(true);
  };

  // Update
  const handleUpdateDocument = async (formData) => {
    try {
      await updateDocument(selectedDocument.document_id, formData);

      await fetchDocuments();

      setSelectedDocument(null);
      setIsEditing(false);

      toast.success("Document updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update document");

      throw error;
    }
  };

  // Delete
  const handleDelete = async (documentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDocument(documentId);

      if (documents.length === 1 && page > 1) {
        setPage((previousPage) => previousPage - 1);
      } else {
        await fetchDocuments();
      }

      toast.success("Document deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete document");
    }
  };

  const handleCancelEdit = () => {
    setSelectedDocument(null);
    setIsEditing(false);
  };

  // Filter
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  // Records per page
  const handleLimitChange = (event) => {
    setLimit(Number(event.target.value));
    setPage(1);
  };

  // Pagination
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
    <div className="document-page">
      <div className="document-page-header">
        <div>
          <p className="document-page-eyebrow">Customer Documents</p>

          <h1>Document Management</h1>

          <p className="document-page-subtitle">
            Upload, verify and manage customer documents.
          </p>
        </div>

        <div className="document-count-card">
          <div className="document-count-icon">
            <FaFileAlt />
          </div>

          <div>
            <small>Total Documents</small>
            <h3>{pagination.totalRecords}</h3>
          </div>
        </div>
      </div>

      <section className="document-section-card">
        {role === "admin" || role === "agent" ? (
          <DocumentForm
            onSubmit={
              isEditing && role === "admin"
                ? handleUpdateDocument
                : handleAddDocument
            }
            selectedDocument={role === "admin" ? selectedDocument : null}
            isEditing={role === "admin" ? isEditing : false}
            users={users}
          />
        ) : null}

        {role === "admin" && isEditing && (
          <div className="document-cancel-wrapper">
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

      <section className="document-section-card document-list-section">
        <div className="document-toolbar">
          <div className="document-search-wrapper">
            <FaSearch className="document-search-icon" />

            <input
              type="search"
              className="form-control"
              placeholder="Search customer, type or file path..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search documents"
            />
          </div>

          <div className="document-status-wrapper">
            <label htmlFor="document-status">Status</label>

            <select
              id="document-status"
              className="form-select"
              value={status}
              onChange={handleStatusChange}
              disabled={loading}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="document-limit-wrapper">
            <label htmlFor="document-limit">Records per page</label>

            <select
              id="document-limit"
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

        <div className="document-table-container">
          {loading && (
            <div className="document-table-loading">
              <div
                className="spinner-border spinner-border-sm text-primary"
                role="status"
              >
                <span className="visually-hidden">Loading documents...</span>
              </div>

              <span>Loading records...</span>
            </div>
          )}

          <div className="table-responsive mt-4">
            <table className="table document-table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Document Type</th>
                  <th>Status</th>
                  <th>Uploaded At</th>
                  <th>Document</th>
                  {role === "admin" && <th className="text-center">Actions</th>}
                </tr>
              </thead>

              <tbody>
                {documents.length === 0 && !loading ? (
                  <tr>
                    <td
                      colSpan={role === "admin" ? 7 : 6}
                      className="document-empty-state"
                    >
                      {search || status
                        ? "No documents match your search or filter."
                        : "No documents found."}
                    </td>
                  </tr>
                ) : (
                  documents.map((document) => (
                    <tr key={document.document_id}>
                      <td>
                        <span className="document-id">
                          #{document.document_id}
                        </span>
                      </td>

                      <td>
                        <div className="document-customer-cell">
                          <div className="document-avatar">
                            {document.full_name?.charAt(0).toUpperCase()}
                          </div>

                          <span>{document.full_name}</span>
                        </div>
                      </td>

                      <td>
                        <span className="document-type-badge">
                          {document.document_type}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`document-status-badge ${
                            document.verification_status === "Verified"
                              ? "document-status-verified"
                              : document.verification_status === "Pending"
                                ? "document-status-pending"
                                : "document-status-rejected"
                          }`}
                        >
                          {document.verification_status === "Verified" ? (
                            <FaCheckCircle />
                          ) : document.verification_status === "Pending" ? (
                            <FaClock />
                          ) : (
                            <FaTimesCircle />
                          )}

                          {document.verification_status}
                        </span>
                      </td>

                      <td>
                        {document.uploaded_at
                          ? new Date(document.uploaded_at).toLocaleString(
                              "en-IN"
                            )
                          : "-"}
                      </td>

                      <td>
                        <a
                          href={`${API_BASE_URL}/${document.document_path.replace(
                            /\\/g,
                            "/"
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline-primary btn-sm document-view-button"
                        >
                          <FaExternalLinkAlt />
                          <span>View</span>
                        </a>
                      </td>

                      {role === "admin" && (
                        <td>
                          <div className="document-actions">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleEdit(document)}
                              disabled={loading}
                            >
                              <FaEdit />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(document.document_id)}
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
          <div className="document-pagination">
            <p>
              Page {pagination.currentPage} of {pagination.totalPages} | Total
              records: {pagination.totalRecords}
            </p>

            <div className="document-pagination-buttons">
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

export default DocumentPage;
