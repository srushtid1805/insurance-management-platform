const express = require("express");
const router = express.Router();

const {
  assignPolicyToUser,
  fetchAllUserPolicies,
  fetchUserPolicyById,
  updateUserPolicyDetails,
  removeUserPolicy
} = require("../controllers/userPolicyController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

// Admin and agent can assign policies.
// Agent ownership is checked in the controller.
router.post(
  "/",
  protect,
  authorizeRoles("admin", "agent"),
  assignPolicyToUser
);

// Admin sees all assignments.
// Agent sees only assignments for their customers.
router.get(
  "/",
  protect,
  authorizeRoles("admin", "agent"),
  fetchAllUserPolicies
);

// Admin can access any assignment.
// Agent can access only their customers' assignment.
router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "agent"),
  fetchUserPolicyById
);

// Only admin can update an assignment.
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateUserPolicyDetails
);

// Only admin can delete an assignment.
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  removeUserPolicy
);

module.exports = router;