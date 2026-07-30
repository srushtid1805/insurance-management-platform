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

// Upload Document
router.post("/", upload.single("document"), addDocument);

// Get All Documents
router.get("/", getDocuments);

// Get Document By ID
router.get("/:id", getDocument);

// Update Document
router.put("/:id", upload.single("document"), updateDocumentDetails);

// Delete Document
router.delete("/:id", deleteDocumentDetails);

module.exports = router;