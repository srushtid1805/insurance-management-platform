import axios from "axios";

const API_URL = "http://localhost:5000/api/documents";

// Get all documents
export const getAllDocuments = async (
  search = "",
  status = "",
  page = 1,
  limit = 5
) => {
  const response = await axios.get(API_URL, {
    params: {
      search,
      status,
      page,
      limit,
    },
  });

  return response.data;
};

// Upload a new document
export const createDocument = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Update document details or verification status
export const updateDocument = async (documentId, formData) => {
  const response = await axios.put(
    `${API_URL}/${documentId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Delete document
export const deleteDocument = async (documentId) => {
  const response = await axios.delete(`${API_URL}/${documentId}`);
  return response.data;
};