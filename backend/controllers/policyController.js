const {
    createPolicy,
    getAllPolicies,
    getPolicyById,
    updatePolicy,
    deletePolicy,
} = require("../models/policyModel");

// Create policy
const createNewPolicy = async (req, res) => {
    try {
        const {
            policy_name,
            policy_type,
            premium_amount,
            coverage_amount,
            duration_months,
            description,
            status,
        } = req.body;

        const policy = await createPolicy(
            policy_name,
            policy_type,
            premium_amount,
            coverage_amount,
            duration_months,
            description,
            status
        );

        res.status(201).json({
            message: "Policy created successfully",
            policy,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// Get all policies
// Get all policies
const getPolicies = async (req, res) => {
    try {
        const search = req.query.search || "";
        const status = req.query.status || "";

        const page = Math.max(
            parseInt(req.query.page, 10) || 1,
            1
        );

        const limit = Math.max(
            parseInt(req.query.limit, 10) || 5,
            1
        );

        const {
            policies,
            totalRecords,
        } = await getAllPolicies({
            search,
            status,
            page,
            limit,
        });

        res.status(200).json({
            message: "Policies fetched successfully",
            data: policies,

            pagination: {
                currentPage: page,
                totalPages: Math.ceil(
                    totalRecords / limit
                ),
                totalRecords,
                limit,
            },
        });
    } catch (error) {
        console.error(
            "Error fetching policies:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch policies",
            error: error.message,
        });
    }
};

// Get policy by ID
const getPolicy = async (req, res) => {
    try {
        const { id } = req.params;

        const policy = await getPolicyById(id);

        if (!policy) {
            return res.status(404).json({
                message: "Policy not found",
            });
        }

        res.status(200).json({
            message: "Policy fetched successfully",
            policy,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// Update policy
const updatePolicyDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            policy_name,
            policy_type,
            premium_amount,
            coverage_amount,
            duration_months,
            description,
            status,
        } = req.body;

        const policy = await updatePolicy(
            id,
            policy_name,
            policy_type,
            premium_amount,
            coverage_amount,
            duration_months,
            description,
            status
        );

        if (!policy) {
            return res.status(404).json({
                message: "Policy not found",
            });
        }

        res.status(200).json({
            message: "Policy updated successfully",
            policy,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// Delete policy
const removePolicy = async (req, res) => {
    try {
        const { id } = req.params;

        const policy = await deletePolicy(id);

        if (!policy) {
            return res.status(404).json({
                message: "Policy not found",
            });
        }

        res.status(200).json({
            message: "Policy deleted successfully",
            policy,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    createNewPolicy,
    getPolicies,
    getPolicy,
    updatePolicyDetails,
    removePolicy,
};