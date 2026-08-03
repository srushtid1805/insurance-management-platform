const pool = require("../config/db");

// Create Claim
const createClaim = async (
  user_policy_id,
  claim_amount,
  claim_reason,
  claim_date,
  claim_status
) => {
  const result = await pool.query(
    `
      INSERT INTO claims
      (
        user_policy_id,
        claim_amount,
        claim_reason,
        claim_date,
        claim_status
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `,
    [
      user_policy_id,
      claim_amount,
      claim_reason,
      claim_date,
      claim_status,
    ]
  );

  return result.rows[0];
};


// Get All Claims
// Get all claims
const getAllClaims = async ({
  search = "",
  status = "",
  page = 1,
  limit = 5,
  role,
  userId
}) => {
  const offset = (page - 1) * limit;

  const values = [];
  const conditions = [];

  if (search) {
    values.push(`%${search}%`);

    conditions.push(`
      (
        u.full_name ILIKE $${values.length}
        OR p.policy_name ILIKE $${values.length}
        OR c.claim_reason ILIKE $${values.length}
        OR CAST(c.claim_amount AS TEXT) ILIKE $${values.length}
      )
    `);
  }

  if (status) {
    values.push(status);

    conditions.push(`
      c.claim_status = $${values.length}
    `);
  }

  if (role === "agent") {
    values.push(userId);

    conditions.push(`
      u.agent_id = $${values.length}
    `);
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

  const countResult = await pool.query(
    `
      SELECT COUNT(*) AS total_records
      FROM claims c

      JOIN user_policies up
        ON c.user_policy_id = up.id

      JOIN users u
        ON up.user_id = u.id

      JOIN policies p
        ON up.policy_id = p.policy_id

      ${whereClause};
    `,
    values
  );

  const totalRecords = Number(
    countResult.rows[0].total_records
  );

  const listValues = [...values, limit, offset];
  const limitPosition = listValues.length - 1;
  const offsetPosition = listValues.length;

  const result = await pool.query(
    `
      SELECT
        c.claim_id,
        c.user_policy_id,
        c.claim_amount,
        c.claim_reason,
        c.claim_date,
        c.claim_status,

        u.full_name,
        u.email,

        p.policy_name,
        p.policy_type

      FROM claims c

      JOIN user_policies up
        ON c.user_policy_id = up.id

      JOIN users u
        ON up.user_id = u.id

      JOIN policies p
        ON up.policy_id = p.policy_id

      ${whereClause}

      ORDER BY c.claim_id DESC

      LIMIT $${limitPosition}
      OFFSET $${offsetPosition};
    `,
    listValues
  );

  return {
    claims: result.rows,
    totalRecords
  };
};

// Get Claim By ID
// Get claim by ID
const getClaimById = async (
  claimId,
  role,
  userId
) => {
  const values = [claimId];
  const conditions = ["c.claim_id = $1"];

  if (role === "agent") {
    values.push(userId);

    conditions.push(`
      u.agent_id = $${values.length}
    `);
  }

  const result = await pool.query(
    `
      SELECT
        c.claim_id,
        c.user_policy_id,
        c.claim_amount,
        c.claim_reason,
        c.claim_date,
        c.claim_status,

        u.full_name,
        u.email,

        p.policy_name,
        p.policy_type

      FROM claims c

      JOIN user_policies up
        ON c.user_policy_id = up.id

      JOIN users u
        ON up.user_id = u.id

      JOIN policies p
        ON up.policy_id = p.policy_id

      WHERE ${conditions.join(" AND ")};
    `,
    values
  );

  return result.rows[0] || null;
};

// Update Claim
const updateClaim = async (
  claim_id,
  user_policy_id,
  claim_amount,
  claim_reason,
  claim_date,
  claim_status
) => {
  const result = await pool.query(
    `
      UPDATE claims
      SET
        user_policy_id = $1,
        claim_amount = $2,
        claim_reason = $3,
        claim_date = $4,
        claim_status = $5
      WHERE claim_id = $6
      RETURNING *;
    `,
    [
      user_policy_id,
      claim_amount,
      claim_reason,
      claim_date,
      claim_status,
      claim_id,
    ]
  );

  return result.rows[0];
};

// Delete Claim
const deleteClaim = async (claim_id) => {
  const result = await pool.query(
    `
      DELETE FROM claims
      WHERE claim_id = $1
      RETURNING *;
    `,
    [claim_id]
  );

  return result.rows[0];
};

// Get logged-in customer's claims
const getCustomerClaims = async (customerId) => {
  const result = await pool.query(
    `
      SELECT
        c.claim_id,
        c.claim_amount,
        c.claim_reason,
        c.claim_date,
        c.claim_status,

        up.id AS user_policy_id,

        p.policy_name,
        p.policy_type

      FROM claims c

      JOIN user_policies up
        ON c.user_policy_id = up.id

      JOIN policies p
        ON up.policy_id = p.policy_id

      WHERE up.user_id = $1

      ORDER BY c.claim_date DESC, c.claim_id DESC;
    `,
    [customerId]
  );

  return result.rows;
};

const checkUserPolicyBelongsToAgent = async (
  userPolicyId,
  agentId
) => {
  const result = await pool.query(
    `
      SELECT up.id
      FROM user_policies up

      JOIN users u
        ON up.user_id = u.id

      WHERE up.id = $1
        AND u.agent_id = $2;
    `,
    [userPolicyId, agentId]
  );

  return Boolean(result.rows[0]);
};

module.exports = {
  createClaim,
  getAllClaims,
  getClaimById,
  updateClaim,
  deleteClaim,
  getCustomerClaims,
  checkUserPolicyBelongsToAgent,
};