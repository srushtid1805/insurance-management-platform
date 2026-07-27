const express = require("express");
const router = express.Router();

const {
    createNewPolicy,
    getPolicies,
    getPolicy,
    updatePolicyDetails,
    removePolicy,
} = require("../controllers/policyController");

// Create Policy
router.post("/", createNewPolicy);

// Get All Policies
router.get("/", getPolicies);

// Get Policy By ID
router.get("/:id", getPolicy);

// Update Policy
router.put("/:id", updatePolicyDetails);

// Delete Policy
router.delete("/:id", removePolicy);

module.exports = router;