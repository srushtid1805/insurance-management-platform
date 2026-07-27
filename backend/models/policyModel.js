const pool = require("../config/db");

// Create policy
const createPolicy = async (
    policy_name,
    policy_type,
    premium_amount,
    coverage_amount,
    duration_months,
    description,
    status
) => {
    const query = `
        INSERT INTO policies (
            policy_name,
            policy_type,
            premium_amount,
            coverage_amount,
            duration_months,
            description,
            status
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7
        )
            RETURNING *;
    `;

    const values = [
        policy_name,
        policy_type,
        premium_amount,
        coverage_amount,
        duration_months,
        description,
        status,
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};

// Get all policies
const getAllPolicies = async () => {
    const query = `
        SELECT 
            policy_id,
            policy_name,
            policy_type,
            premium_amount,
            coverage_amount,
            duration_months,
            description,
            status
        FROM policies
        ORDER BY policy_id;
    `;

    const result = await pool.query(query);

    return result.rows;
};

// Get policy by ID
const getPolicyById = async (policy_id) => {
    const query = `
        SELECT
            policy_id,
            policy_name,
            policy_type,
            premium_amount,
            coverage_amount,
            duration_months,
            description,
            status
        FROM policies
        WHERE policy_id = $1;
    `;

    const result = await pool.query(query, [policy_id]);

    return result.rows[0];
};

// Update policy
const updatePolicy = async (
    policy_id,
    policy_name,
    policy_type,
    premium_amount,
    coverage_amount,
    duration_months,
    description,
    status
) => {
    const query = `
        UPDATE policies
        SET
            policy_name = $1,
            policy_type = $2,
            premium_amount = $3,
            coverage_amount = $4,
            duration_months = $5,
            description = $6,
            status = $7
        WHERE policy_id = $8
        RETURNING *;
    `;

    const values = [
        policy_name,
        policy_type,
        premium_amount,
        coverage_amount,
        duration_months,
        description,
        status,
        policy_id,
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};

// Delete policy
const deletePolicy = async (policy_id) => {
    const query = `
        DELETE FROM policies
        WHERE policy_id = $1
        RETURNING
            policy_id,
            policy_name,
            policy_type,
            premium_amount,
            coverage_amount,
            duration_months,
            description,
            status;
    `;

    const result = await pool.query(query, [policy_id]);

    return result.rows[0];
};

module.exports = {
    createPolicy,
    getAllPolicies,
    getPolicyById,
    updatePolicy,
    deletePolicy,
};