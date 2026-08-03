const fs = require("fs");

const {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  getCustomerDocuments,
  checkCustomerBelongsToAgent
} = require("../models/documentModel");

// Upload Document
const addDocument = async (req, res) => {
  try {
    const { user_id, document_type } = req.body;

    if (req.user.role === "agent") {
      const belongsToAgent = await checkCustomerBelongsToAgent(
        user_id,
        req.user.id
      );

      if (!belongsToAgent) {
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(403).json({
          message: "You can upload documents only for your own customers"
        });
      }
    }

    if (!user_id || !document_type) {
      return res.status(400).json({
        message: "User and document type are required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please select a document"
      });
    }

    const document_path = req.file.path;
    const verification_status = "Pending";

    const document = await createDocument(
      user_id,
      document_type,
      document_path,
      verification_status
    );

    res.status(201).json({
      message: "Document uploaded successfully",
      document
    });
  } catch (error) {
    console.error("Upload document error:", error);

    res.status(500).json({
      message: error.message || "Failed to upload document"
    });
  }
};

// Get All Documents
const getDocuments = async (req, res) => {
  try {
    const { search = "", status = "", page = 1, limit = 5 } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const recordsPerPage = Math.max(Number(limit) || 5, 1);

    const result = await getAllDocuments({
      search: search.trim(),
      status: status.trim(),
      page: currentPage,
      limit: recordsPerPage,
      role: req.user.role,
      userId: req.user.id
    });

    const totalPages = Math.ceil(result.totalRecords / recordsPerPage);

    res.status(200).json({
      message: "Documents fetched successfully",
      data: result.documents,
      pagination: {
        currentPage,
        totalPages,
        totalRecords: result.totalRecords,
        limit: recordsPerPage
      }
    });
  } catch (error) {
    console.error("Fetch documents error:", error);

    res.status(500).json({
      message: "Failed to fetch documents"
    });
  }
};

// Get Document By ID
const getDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await getDocumentById(id, req.user.role, req.user.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found"
      });
    }

    res.status(200).json({
      message: "Document fetched successfully",
      document
    });
  } catch (error) {
    console.error("Fetch document error:", error);

    res.status(500).json({
      message: "Failed to fetch document"
    });
  }
};

// Update Document Details or Verification Status
const updateDocumentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const existingDocument = await getDocumentById(
      id,
      req.user.role,
      req.user.id
    );
    if (!existingDocument) {
      return res.status(404).json({
        message: "Document not found"
      });
    }

    const { user_id, document_type, verification_status } = req.body;

    const targetUserId = user_id || existingDocument.user_id;

    if (req.user.role === "agent") {
      const belongsToAgent = await checkCustomerBelongsToAgent(
        targetUserId,
        req.user.id
      );

      if (!belongsToAgent) {
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(403).json({
          message: "You can update documents only for your own customers"
        });
      }
    }

    const document_path = req.file
      ? req.file.path
      : existingDocument.document_path;

    const document = await updateDocument(
      id,
      targetUserId,
      document_type || existingDocument.document_type,
      document_path,
      verification_status || existingDocument.verification_status
    );

    if (
      req.file &&
      existingDocument.document_path &&
      fs.existsSync(existingDocument.document_path)
    ) {
      fs.unlinkSync(existingDocument.document_path);
    }

    res.status(200).json({
      message: "Document updated successfully",
      document
    });
  } catch (error) {
    console.error("Update document error:", error);

    res.status(500).json({
      message: "Failed to update document"
    });
  }
};

// Delete Document
const deleteDocumentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await deleteDocument(id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found"
      });
    }

    if (document.document_path && fs.existsSync(document.document_path)) {
      fs.unlinkSync(document.document_path);
    }

    res.status(200).json({
      message: "Document deleted successfully",
      document
    });
  } catch (error) {
    console.error("Delete document error:", error);

    res.status(500).json({
      message: "Failed to delete document"
    });
  }
};

// Get logged-in customer's documents
const getMyDocuments = async (req, res) => {
  try {
    const customerId = req.user.id;

    const documents = await getCustomerDocuments(customerId);

    return res.status(200).json({
      message: "Customer documents fetched successfully",
      data: documents
    });
  } catch (error) {
    console.error("Error fetching customer documents:", error);

    return res.status(500).json({
      message: "Failed to fetch customer documents",
      error: error.message
    });
  }
};

module.exports = {
  addDocument,
  getDocuments,
  getDocument,
  updateDocumentDetails,
  deleteDocumentDetails,
  getMyDocuments
};
