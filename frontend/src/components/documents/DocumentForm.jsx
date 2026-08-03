import { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const initialFormData = {
  user_id: "",
  document_type: "",
  verification_status: "Pending"
};

const DocumentForm = ({
  onSubmit,
  selectedDocument,
  isEditing,
  users = []
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [documentFile, setDocumentFile] = useState(null);

  useEffect(() => {
    if (selectedDocument) {
      setFormData({
        user_id: selectedDocument.user_id || "",
        document_type: selectedDocument.document_type || "",
        verification_status: selectedDocument.verification_status || "Pending"
      });
    } else {
      setFormData(initialFormData);
      setDocumentFile(null);
    }
  }, [selectedDocument]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("user_id", formData.user_id);
    data.append("document_type", formData.document_type);
    data.append("verification_status", formData.verification_status);

    if (documentFile) {
      data.append("document", documentFile);
    }

    await onSubmit(data);

    if (!isEditing) {
      setFormData(initialFormData);
      setDocumentFile(null);
      e.target.reset();
    }
  };

  return (
    <form className="document-form" onSubmit={handleSubmit}>
      <div className="document-form-header">
        <p className="document-form-eyebrow">
          {isEditing ? "Update Record" : "New Document"}
        </p>

        <h3>{isEditing ? "Update Document" : "Upload Document"}</h3>

        <p>
          {isEditing
            ? "Update the selected document details or replace the uploaded file."
            : "Upload and manage customer verification documents."}
        </p>
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label htmlFor="user_id" className="form-label">
            Customer
          </label>

          <select
            id="user_id"
            name="user_id"
            className="form-select"
            value={formData.user_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Customer</option>

            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.full_name || user.fullName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="document_type" className="form-label">
            Document Type
          </label>

          <select
            id="document_type"
            name="document_type"
            className="form-select"
            value={formData.document_type}
            onChange={handleChange}
            required
          >
            <option value="">Select Document Type</option>
            <option value="Aadhaar Card">Aadhaar Card</option>
            <option value="PAN Card">PAN Card</option>
            <option value="Driving License">Driving License</option>
            <option value="Passport">Passport</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="document" className="form-label">
            Document File
          </label>

          <input
            id="document"
            type="file"
            className="form-control"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            required={!isEditing}
          />

          <small className="text-muted">
            Accepted formats: PDF, JPG, JPEG and PNG.
          </small>
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="verification_status" className="form-label">
            Verification Status
          </label>

          {isEditing ? (
            <select
              id="verification_status"
              name="verification_status"
              className="form-select"
              value={formData.verification_status}
              onChange={handleChange}
              required
            >
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          ) : (
            <div className="document-pending-status">Pending</div>
          )}
        </div>

        {isEditing && selectedDocument?.document_path && (
          <div className="col-12">
            <div className="document-current-file">
              <div>
                <strong>Current document</strong>

                <p className="mb-1">
                  A file is already uploaded for this record.
                </p>

                <small className="text-muted">
                  Select a new file only when you want to replace it.
                </small>
              </div>

              <a
                href={`${API_BASE_URL}/${selectedDocument.document_path.replace(
                  /\\/g,
                  "/"
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-primary btn-sm"
              >
                View Current Document
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="document-form-actions">
        <button type="submit" className="btn btn-primary">
          {isEditing ? "Update Document" : "Upload Document"}
        </button>
      </div>
    </form>
  );
};

export default DocumentForm;
