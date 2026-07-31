const express = require("express");
const router = express.Router();

const {
  assignPolicyToUser,
  fetchAllUserPolicies,
  fetchUserPolicyById,
  updateUserPolicyDetails,
  removeUserPolicy
} = require("../controllers/userPolicyController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Assign a policy to a user
router.post("/", protect, authorizeRoles("admin"), assignPolicyToUser);

// Get all assigned policies
router.get(
  "/",
  protect,
  authorizeRoles("admin", "agent"),
  fetchAllUserPolicies
);

// Get one assigned policy
router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "agent"),
  fetchUserPolicyById
);

// Update assigned policy
router.put("/:id", protect, authorizeRoles("admin"), updateUserPolicyDetails);

// Delete assigned policy
router.delete("/:id", protect, authorizeRoles("admin"), removeUserPolicy);

module.exports = router;
