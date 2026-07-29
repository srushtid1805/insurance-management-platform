const {
    createUserPolicy,
    getAllUserPolicies,
    getUserPolicyById,
    updateUserPolicy,
    deleteUserPolicy,
} = require("../models/userPolicyModel");

const assignPolicyToUser = async (req, res) => {
    try {
        const {
            user_id,
            policy_id,
            nominee_name,
            purchase_date,
            next_premium_date,
            expiry_date,
            policy_status,
        } = req.body;

        if (!user_id || !policy_id || !purchase_date) {
            return res.status(400).json({
                message:
                    "User ID, policy ID, and purchase date are required",
            });
        }

        const userPolicy = await createUserPolicy(
            user_id,
            policy_id,
            nominee_name || null,
            purchase_date,
            next_premium_date || null,
            expiry_date || null,
            policy_status || "Active"
        );

        return res.status(201).json({
            message: "Policy assigned to user successfully",
            userPolicy,
        });
    } catch (error) {
        console.error("Assign policy error:", error);

        return res.status(500).json({
            message: "Failed to assign policy to user",
        });
    }
};

const fetchAllUserPolicies = async (req, res) => {
    try {
        const userPolicies = await getAllUserPolicies();

        return res.status(200).json({
            count: userPolicies.length,
            userPolicies,
        });
    } catch (error) {
        console.error("Fetch user policies error:", error);

        return res.status(500).json({
            message: "Failed to fetch user policies",
        });
    }
};

const fetchUserPolicyById = async (req, res) => {
    try {
        const { id } = req.params;

        const userPolicy = await getUserPolicyById(id);

        if (!userPolicy) {
            return res.status(404).json({
                message: "User policy not found",
            });
        }

        return res.status(200).json(userPolicy);
    } catch (error) {
        console.error("Fetch user policy error:", error);

        return res.status(500).json({
            message: "Failed to fetch user policy",
        });
    }
};

const updateUserPolicyDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            user_id,
            policy_id,
            nominee_name,
            purchase_date,
            next_premium_date,
            expiry_date,
            policy_status,
        } = req.body;

        if (!user_id || !policy_id || !purchase_date) {
            return res.status(400).json({
                message:
                    "User ID, policy ID, and purchase date are required",
            });
        }

        const updatedUserPolicy = await updateUserPolicy(
            id,
            user_id,
            policy_id,
            nominee_name || null,
            purchase_date,
            next_premium_date || null,
            expiry_date || null,
            policy_status || "Active"
        );

        if (!updatedUserPolicy) {
            return res.status(404).json({
                message: "User policy not found",
            });
        }

        return res.status(200).json({
            message: "User policy updated successfully",
            userPolicy: updatedUserPolicy,
        });
    } catch (error) {
        console.error("Update user policy error:", error);

        return res.status(500).json({
            message: "Failed to update user policy",
        });
    }
};

const removeUserPolicy = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUserPolicy = await deleteUserPolicy(id);

        if (!deletedUserPolicy) {
            return res.status(404).json({
                message: "User policy not found",
            });
        }

        return res.status(200).json({
            message: "User policy deleted successfully",
            userPolicy: deletedUserPolicy,
        });
    } catch (error) {
        console.error("Delete user policy error:", error);

        return res.status(500).json({
            message: "Failed to delete user policy",
        });
    }
};

module.exports = {
    assignPolicyToUser,
    fetchAllUserPolicies,
    fetchUserPolicyById,
    updateUserPolicyDetails,
    removeUserPolicy,
};