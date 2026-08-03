const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
  addDocument,
  getDocuments,
  getDocument,
  updateDocumentDetails,
  deleteDocumentDetails,
  getMyDocuments
} = require("../controllers/documentController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

// Upload document
router.post(
  "/",
  protect,
  authorizeRoles("admin", "agent"),
  upload.single("document"),
  addDocument
);

// Get all documents for admin and agent
router.get(
  "/",
  protect,
  authorizeRoles("admin", "agent"),
  getDocuments
);

// Customer: get only their own documents
// Keep this before "/:id"
router.get(
  "/my-documents",
  protect,
  authorizeRoles("customer"),
  getMyDocuments
);

// Get document by ID
router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "agent"),
  getDocument
);

// Update document
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "agent"),
  upload.single("document"),
  updateDocumentDetails
);

// Delete document
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteDocumentDetails
);

module.exports = router;