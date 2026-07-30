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
const getAllClaims = async ({
  search = "",
  status = "",
  page = 1,
  limit = 5,
}) => {
  const offset = (page - 1) * limit;

  const values = [];
  const conditions = [];

  // Search
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

  // Status Filter
  if (status) {
    values.push(status);

    conditions.push(`
      c.claim_status = $${values.length}
    `);
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

  // Total Records
  const countQuery = `
    SELECT COUNT(*) AS total_records

    FROM claims c

    JOIN user_policies up
      ON c.user_policy_id = up.id

    JOIN users u
      ON up.user_id = u.id

    JOIN policies p
      ON up.policy_id = p.policy_id

    ${whereClause};
  `;

  const countResult = await pool.query(
    countQuery,
    values
  );

  const totalRecords = Number(
    countResult.rows[0].total_records
  );

  values.push(limit);
  const limitPosition = values.length;

  values.push(offset);
  const offsetPosition = values.length;

  // Fetch Claims
  const query = `
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
  `;

  const result = await pool.query(
    query,
    values
  );

  return {
    claims: result.rows,
    totalRecords,
  };
};

// Get Claim By ID
const getClaimById = async (claim_id) => {
  const result = await pool.query(
    `
      SELECT *
      FROM claims
      WHERE claim_id = $1;
    `,
    [claim_id]
  );

  return result.rows[0];
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

module.exports = {
  createClaim,
  getAllClaims,
  getClaimById,
  updateClaim,
  deleteClaim,
};