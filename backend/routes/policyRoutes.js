const express = require("express");
const router = express.Router();

const {
  createNewPolicy,
  getPolicies,
  getPolicy,
  updatePolicyDetails,
  removePolicy
} = require("../controllers/policyController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Create Policy
router.post("/", protect, authorizeRoles("admin"), createNewPolicy);

// Get All Policies
router.get("/", protect, authorizeRoles("admin", "agent"), getPolicies);

// Get Policy By ID
router.get("/:id", protect, authorizeRoles("admin", "agent"), getPolicy);

// Update Policy
router.put("/:id", protect, authorizeRoles("admin"), updatePolicyDetails);

// Delete Policy
router.delete("/:id", protect, authorizeRoles("admin"), removePolicy);

module.exports = router;
