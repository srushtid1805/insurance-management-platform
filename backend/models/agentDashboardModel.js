const pool = require("../config/db");

const getAgentDashboardSummary = async (agentId) => {
  const result = await pool.query(
    `
      SELECT
        (
          SELECT COUNT(*)::INT
          FROM users
          WHERE agent_id = $1
            AND role = 'customer'
        ) AS total_customers,

        (
          SELECT COUNT(*)::INT
          FROM user_policies up
          JOIN users u
            ON up.user_id = u.id
          WHERE u.agent_id = $1
        ) AS total_assigned_policies,

        (
          SELECT COUNT(*)::INT
          FROM payments p
          JOIN user_policies up
            ON p.user_policy_id = up.id
          JOIN users u
            ON up.user_id = u.id
          WHERE u.agent_id = $1
            AND p.payment_status = 'Pending'
        ) AS pending_payments,

        (
          SELECT COUNT(*)::INT
          FROM claims c
          JOIN user_policies up
            ON c.user_policy_id = up.id
          JOIN users u
            ON up.user_id = u.id
          WHERE u.agent_id = $1
            AND c.claim_status = 'Pending'
        ) AS pending_claims,

        (
          SELECT COUNT(*)::INT
          FROM documents d
          JOIN users u
            ON d.user_id = u.id
          WHERE u.agent_id = $1
            AND d.verification_status = 'Pending'
        ) AS pending_documents;
    `,
    [agentId]
  );

  return result.rows[0];
};

const getAgentCustomers = async (agentId) => {
  const result = await pool.query(
    `
      SELECT
        id,
        full_name,
        email,
        phone,
        address,
        created_at
      FROM users
      WHERE agent_id = $1
        AND role = 'customer'
      ORDER BY created_at DESC
      LIMIT 5;
    `,
    [agentId]
  );

  return result.rows;
};

module.exports = {
  getAgentDashboardSummary,
  getAgentCustomers
};