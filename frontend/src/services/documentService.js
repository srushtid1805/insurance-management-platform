import api from "./api";

const DOCUMENT_URL = "/documents";

// Get all documents
export const getAllDocuments = async (
  search = "",
  status = "",
  page = 1,
  limit = 5
) => {
  try {
    const response = await api.get(DOCUMENT_URL, {
      params: {
        search,
        status,
        page,
        limit,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

// Upload a new document
export const createDocument = async (formData) => {
  try {
    const response = await api.post(
      DOCUMENT_URL,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
};

// Update document
export const updateDocument = async (
  documentId,
  formData
) => {
  try {
    const response = await api.put(
      `${DOCUMENT_URL}/${documentId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

// Delete document
export const deleteDocument = async (documentId) => {
  try {
    const response = await api.delete(
      `${DOCUMENT_URL}/${documentId}`
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};