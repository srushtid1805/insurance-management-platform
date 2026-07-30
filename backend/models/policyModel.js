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
const getAllPolicies = async ({
  search = "",
  status = "",
  page = 1,
  limit = 5,
}) => {
  const offset = (page - 1) * limit;
  const searchValue = `%${search}%`;

  let query = `
    SELECT *
    FROM policies
    WHERE (
      policy_name ILIKE $1
      OR policy_type ILIKE $1
      OR description ILIKE $1
    )
  `;

  let countQuery = `
    SELECT COUNT(*)::INT AS total
    FROM policies
    WHERE (
      policy_name ILIKE $1
      OR policy_type ILIKE $1
      OR description ILIKE $1
    )
  `;

  const params = [searchValue];
  const countParams = [searchValue];

  if (status) {
    query += ` AND status = $2`;
    countQuery += ` AND status = $2`;

    params.push(status);
    countParams.push(status);
  }

  query += `
    ORDER BY policy_id DESC
    LIMIT $${params.length + 1}
    OFFSET $${params.length + 2}
  `;

  params.push(limit);
  params.push(offset);

  const policiesResult = await pool.query(query, params);

  const countResult = await pool.query(
    countQuery,
    countParams
  );

  return {
    policies: policiesResult.rows,
    totalRecords: countResult.rows[0].total,
  };
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