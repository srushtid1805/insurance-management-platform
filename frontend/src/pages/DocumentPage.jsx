import { useCallback, useEffect, useState } from "react";
import DocumentForm from "../components/documents/DocumentForm";

import {
  getAllDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} from "../services/documentService";

import { getCustomers } from "../services/customerService";

const DocumentPage = () => {
  const [documents, setDocuments] = useState([]);
  const [users, setUsers] = useState([]);

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
    limit: 5,
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
          limit,
        }
      );
    } catch (error) {
      console.error("Error fetching documents:", error);

      setDocuments([]);
      setError(
        error.response?.data?.message ||
          "Failed to fetch documents"
      );
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, page, limit]);

  // Fetch Customers
  const fetchUsers = async () => {
    try {
      const response = await getCustomers(
        "",
        1,
        1000
      );

      setUsers(
        Array.isArray(response)
          ? response
          : response.customers || response.data || []
      );
    } catch (error) {
      console.error("Error fetching customers:", error);
      setUsers([]);
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

      setPage(1);

      if (page === 1) {
        await fetchDocuments();
      }

      alert("Document uploaded successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to upload document"
      );

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
      await updateDocument(
        selectedDocument.document_id,
        formData
      );

      await fetchDocuments();

      setSelectedDocument(null);
      setIsEditing(false);

      alert("Document updated successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update document"
      );

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

      alert("Document deleted successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete document"
      );
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
      <h1>Document Management</h1>

      <DocumentForm
        onSubmit={
          isEditing
            ? handleUpdateDocument
            : handleAddDocument
        }
        selectedDocument={selectedDocument}
        isEditing={isEditing}
        users={users}
      />

      {isEditing && (
        <button
          type="button"
          onClick={handleCancelEdit}
        >
          Cancel Edit
        </button>
      )}

      <h2>Document List</h2>

      <div>
        <label>Search Documents:</label>

        <input
          type="text"
          placeholder="Search customer, type or path"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      <div>
        <label>Filter by Status:</label>

        <select
          value={status}
          onChange={handleStatusChange}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Verified">Verified</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div>
        <label>Records per page:</label>

        <select
          value={limit}
          onChange={handleLimitChange}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>

      {error && <p>{error}</p>}

      {loading && <p>Loading documents...</p>}

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Document Type</th>
            <th>Status</th>
            <th>Uploaded At</th>
            <th>Document</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {!loading &&
          documents.length === 0 ? (
            <tr>
              <td colSpan="7">
                No documents found
              </td>
            </tr>
          ) : (
            documents.map((document) => (
              <tr key={document.document_id}>
                <td>{document.document_id}</td>

                <td>{document.full_name}</td>

                <td>{document.document_type}</td>

                <td>
                  {document.verification_status}
                </td>

                <td>
                  {document.uploaded_at
                    ? new Date(
                        document.uploaded_at
                      ).toLocaleString()
                    : ""}
                </td>

                <td>
                  <a
                    href={`http://localhost:5000/${document.document_path}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Document
                  </a>
                </td>

                <td>
                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(document)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        document.document_id
                      )
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
            {pagination.totalPages}
            {" — "}
            Total records:{" "}
            {pagination.totalRecords}
          </p>

          <button
            type="button"
            onClick={() =>
              setPage((p) => p - 1)
            }
            disabled={page === 1 || loading}
          >
            Previous
          </button>

          {renderPageNumbers()}

          <button
            type="button"
            onClick={() =>
              setPage((p) => p + 1)
            }
            disabled={
              page === pagination.totalPages ||
              loading
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentPage;