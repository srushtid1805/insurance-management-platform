const express = require("express");
const router = express.Router();

const {
  addClaim,
  getClaims,
  getClaim,
  updateClaimDetails,
  deleteClaimDetails,
} = require("../controllers/claimController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Create Claim
router.post(
  "/", 
  protect,
  authorizeRoles("admin", "agent"),
  addClaim);

// Get All Claims
router.get(
  "/", 
  protect,
  authorizeRoles("admin", "agent"),
  getClaims);

// Get Claim By ID
router.get(
  "/:id", 
  protect,
  authorizeRoles("admin", "agent"),
  getClaim);

// Update Claim
router.put(
  "/:id", 
  protect,
  authorizeRoles("admin", "agent"),
  updateClaimDetails);

// Delete Claim
router.delete(
  "/:id", 
  protect,
  authorizeRoles("admin"),
  deleteClaimDetails);

module.exports = router;