import { useEffect, useState } from "react";

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
    <form onSubmit={handleSubmit}>
      <h2>{isEditing ? "Update Document" : "Upload Document"}</h2>

      <select
        name="user_id"
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

      <select
        name="document_type"
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

      {isEditing && selectedDocument?.document_path && (
        <div>
          <p>
            Current document:{" "}
            <a
              href={`http://localhost:5000/${selectedDocument.document_path}`}
              target="_blank"
              rel="noreferrer"
            >
              View Current Document
            </a>
          </p>

          <small>
            Choose a new file only if you want to replace the current document.
          </small>
        </div>
      )}
      
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
        {...(!isEditing ? { required: true } : {})}
      />

      {isEditing ? (
        <select
          name="verification_status"
          value={formData.verification_status}
          onChange={handleChange}
          required
        >
          <option value="Pending">Pending</option>
          <option value="Verified">Verified</option>
          <option value="Rejected">Rejected</option>
        </select>
      ) : (
        <p>
          Verification Status: <strong>Pending</strong>
        </p>
      )}

      <button type="submit">
        {isEditing ? "Update Document" : "Upload Document"}
      </button>
    </form>
  );
};

export default DocumentForm;
