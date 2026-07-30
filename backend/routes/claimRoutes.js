const express = require("express");
const router = express.Router();

const {
  addClaim,
  getClaims,
  getClaim,
  updateClaimDetails,
  deleteClaimDetails,
} = require("../controllers/claimController");

// Create Claim
router.post("/", addClaim);

// Get All Claims
router.get("/", getClaims);

// Get Claim By ID
router.get("/:id", getClaim);

// Update Claim
router.put("/:id", updateClaimDetails);

// Delete Claim
router.delete("/:id", deleteClaimDetails);

module.exports = router;