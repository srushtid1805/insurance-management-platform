const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
  addDocument,
  getDocuments,
  getDocument,
  updateDocumentDetails,
  deleteDocumentDetails,
} = require("../controllers/documentController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Upload Document
router.post(
  "/", upload.single("document"),
  protect,
  authorizeRoles("admin", "agent"),
  addDocument);

// Get All Documents
router.get(
  "/", 
  protect,
  authorizeRoles("admin", "agent"),
  getDocuments);

// Get Document By ID
router.get(
  "/:id", 
  protect,
  authorizeRoles("admin", "agent"),
  getDocument);

// Update Document
router.put(
  "/:id", 
  upload.single("document"), 
  protect,
  authorizeRoles("admin", "agent"),
  updateDocumentDetails);

// Delete Document
router.delete(
  "/:id", 
  protect,
  authorizeRoles("admin"),
  deleteDocumentDetails);

module.exports = router;