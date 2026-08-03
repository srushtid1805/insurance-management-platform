import "./CustomerDocumentsPage.css";

import { useEffect, useState } from "react";
import {
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaExternalLinkAlt
} from "react-icons/fa";

import {
  getCustomerDocuments
} from "../services/customerDashboardService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const CustomerDocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCustomerDocuments();

      setDocuments(response.data || []);
    } catch (error) {
      console.error("Error loading customer documents:", error);

      setDocuments([]);

      setError(
        error.response?.data?.message ||
          "Failed to load your documents."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date
      ? new Date(date).toLocaleString("en-IN")
      : "-";
  };

  const getDocumentUrl = (documentPath) => {
    if (!documentPath) {
      return "#";
    }

    const normalizedPath = documentPath.replace(/\\/g, "/");

    return `${API_BASE_URL}/${normalizedPath}`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">
            Loading documents...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-documents-page">
      <div className="customer-documents-header">
        <div>
          <p className="customer-documents-eyebrow">
            Verification Documents
          </p>

          <h1>My Documents</h1>

          <p className="customer-documents-subtitle">
            View your uploaded documents and verification status.
          </p>
        </div>

        <div className="customer-documents-count-card">
          <div className="customer-documents-count-icon">
            <FaFileAlt />
          </div>

          <div>
            <small>Total Documents</small>
            <h3>{documents.length}</h3>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <section className="customer-documents-section-card">
        <div className="table-responsive">
          <table className="table customer-documents-table align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Document Type</th>
                <th>Status</th>
                <th>Uploaded At</th>
                <th>Document</th>
              </tr>
            </thead>

            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="customer-documents-empty-state"
                  >
                    No document records are available.
                  </td>
                </tr>
              ) : (
                documents.map((document) => (
                  <tr key={document.document_id}>
                    <td>#{document.document_id}</td>

                    <td>
                      <div className="customer-document-type-cell">
                        <div className="customer-document-icon">
                          <FaFileAlt />
                        </div>

                        <span>{document.document_type}</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`customer-document-status ${
                          document.verification_status === "Verified"
                            ? "customer-document-status-verified"
                            : document.verification_status === "Pending"
                              ? "customer-document-status-pending"
                              : "customer-document-status-rejected"
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

                    <td>{formatDate(document.uploaded_at)}</td>

                    <td>
                      <a
                        href={getDocumentUrl(document.document_path)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline-primary btn-sm customer-document-view-button"
                      >
                        <FaExternalLinkAlt />
                        <span>View Document</span>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default CustomerDocumentsPage;