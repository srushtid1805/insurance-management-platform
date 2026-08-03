const express = require("express");
const router = express.Router();

const {
  addClaim,
  getClaims,
  getClaim,
  updateClaimDetails,
  deleteClaimDetails,
  getMyClaims
} = require("../controllers/claimController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

// Create claim
router.post(
  "/",
  protect,
  authorizeRoles("admin", "agent"),
  addClaim
);

// Get all claims for admin and agent
router.get(
  "/",
  protect,
  authorizeRoles("admin", "agent"),
  getClaims
);

// Customer: get only their own claims
// Keep this before "/:id"
router.get(
  "/my-claims",
  protect,
  authorizeRoles("customer"),
  getMyClaims
);

// Get claim by ID
router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "agent"),
  getClaim
);

// Update claim
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "agent"),
  updateClaimDetails
);

// Delete claim
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteClaimDetails
);

module.exports = router;