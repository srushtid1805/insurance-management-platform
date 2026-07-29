const express = require("express");

const {
    assignPolicyToUser,
    fetchAllUserPolicies,
    fetchUserPolicyById,
    updateUserPolicyDetails,
    removeUserPolicy,
} = require("../controllers/userPolicyController");

const router = express.Router();

// Assign a policy to a user
router.post("/", assignPolicyToUser);

// Get all assigned policies
router.get("/", fetchAllUserPolicies);

// Get one assigned policy
router.get("/:id", fetchUserPolicyById);

// Update assigned policy
router.put("/:id", updateUserPolicyDetails);

// Delete assigned policy
router.delete("/:id", removeUserPolicy);

module.exports = router;