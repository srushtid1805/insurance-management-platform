const pool = require("../config/db");

const checkCustomerBelongsToAgent = async (
  customerId,
  agentId
) => {
  const result = await pool.query(
    `
      SELECT id
      FROM users
      WHERE id = $1
        AND role = 'customer'
        AND agent_id = $2;
    `,
    [customerId, agentId]
  );

  return Boolean(result.rows[0]);
};

const createUserPolicy = async (
  userId,
  policyId,
  nomineeName,
  purchaseDate,
  nextPremiumDate,
  expiryDate,
  policyStatus
) => {
  const result = await pool.query(
    `
      INSERT INTO user_policies
      (
        user_id,
        policy_id,
        nominee_name,
        purchase_date,
        next_premium_date,
        expiry_date,
        policy_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `,
    [
      userId,
      policyId,
      nomineeName,
      purchaseDate,
      nextPremiumDate,
      expiryDate,
      policyStatus
    ]
  );

  return result.rows[0];
};

const getAllUserPolicies = async ({
  search = "",
  status = "",
  page = 1,
  limit = 5,
  role,
  userId
}) => {
  const offset = (page - 1) * limit;
  const searchValue = `%${search}%`;

  const values = [searchValue];

  const conditions = [
    `
      (
        u.full_name ILIKE $1
        OR u.email ILIKE $1
        OR p.policy_name ILIKE $1
        OR p.policy_type ILIKE $1
        OR COALESCE(up.nominee_name, '') ILIKE $1
      )
    `
  ];

  if (status) {
    values.push(status);
    conditions.push(
      `up.policy_status = $${values.length}`
    );
  }

  if (role === "agent") {
    values.push(userId);
    conditions.push(
      `u.agent_id = $${values.length}`
    );
  }

  const whereClause = `WHERE ${conditions.join(
    " AND "
  )}`;

  const countResult = await pool.query(
    `
      SELECT COUNT(*)::INT AS total
      FROM user_policies up

      JOIN users u
        ON up.user_id = u.id

      JOIN policies p
        ON up.policy_id = p.policy_id

      ${whereClause};
    `,
    values
  );

  const listValues = [...values, limit, offset];

  const policiesResult = await pool.query(
    `
      SELECT
        up.id,
        up.user_id,
        u.full_name AS customer_name,
        u.email,
        up.policy_id,
        p.policy_name,
        p.policy_type,
        up.nominee_name,
        up.purchase_date,
        up.next_premium_date,
        up.expiry_date,
        up.policy_status
      FROM user_policies up

      JOIN users u
        ON up.user_id = u.id

      JOIN policies p
        ON up.policy_id = p.policy_id

      ${whereClause}

      ORDER BY up.id DESC

      LIMIT $${listValues.length - 1}
      OFFSET $${listValues.length};
    `,
    listValues
  );

  return {
    userPolicies: policiesResult.rows,
    totalRecords: countResult.rows[0].total
  };
};

const getUserPolicyById = async (
  id,
  role,
  userId
) => {
  const values = [id];
  const conditions = ["up.id = $1"];

  if (role === "agent") {
    values.push(userId);
    conditions.push(
      `u.agent_id = $${values.length}`
    );
  }

  const result = await pool.query(
    `
      SELECT
        up.id,
        up.user_id,
        u.full_name AS customer_name,
        u.email,
        up.policy_id,
        p.policy_name,
        p.policy_type,
        up.nominee_name,
        up.purchase_date,
        up.next_premium_date,
        up.expiry_date,
        up.policy_status
      FROM user_policies up

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

const updateUserPolicy = async (
  id,
  userId,
  policyId,
  nomineeName,
  purchaseDate,
  nextPremiumDate,
  expiryDate,
  policyStatus
) => {
  const result = await pool.query(
    `
      UPDATE user_policies
      SET
        user_id = $1,
        policy_id = $2,
        nominee_name = $3,
        purchase_date = $4,
        next_premium_date = $5,
        expiry_date = $6,
        policy_status = $7
      WHERE id = $8
      RETURNING *;
    `,
    [
      userId,
      policyId,
      nomineeName,
      purchaseDate,
      nextPremiumDate,
      expiryDate,
      policyStatus,
      id
    ]
  );

  return result.rows[0] || null;
};

const deleteUserPolicy = async (id) => {
  const result = await pool.query(
    `
      DELETE FROM user_policies
      WHERE id = $1
      RETURNING *;
    `,
    [id]
  );

  return result.rows[0] || null;
};

module.exports = {
  checkCustomerBelongsToAgent,
  createUserPolicy,
  getAllUserPolicies,
  getUserPolicyById,
  updateUserPolicy,
  deleteUserPolicy
};