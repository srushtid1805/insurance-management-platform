const pool = require("../config/db");

const getCustomerDashboardSummary = async (customerId) => {
  const result = await pool.query(
    `
      SELECT
        (
          SELECT COUNT(*)::INT
          FROM user_policies
          WHERE user_id = $1
        ) AS total_policies,

        (
          SELECT COUNT(*)::INT
          FROM user_policies
          WHERE user_id = $1
            AND policy_status = 'Active'
        ) AS active_policies,

        (
          SELECT COUNT(*)::INT
          FROM user_policies
          WHERE user_id = $1
            AND policy_status = 'Expired'
        ) AS expired_policies,

        (
          SELECT COUNT(*)::INT
          FROM payments p
          JOIN user_policies up
            ON p.user_policy_id = up.id
          WHERE up.user_id = $1
        ) AS total_payments,

        (
          SELECT COUNT(*)::INT
          FROM payments p
          JOIN user_policies up
            ON p.user_policy_id = up.id
          WHERE up.user_id = $1
            AND p.payment_status = 'Pending'
        ) AS pending_payments,

        (
          SELECT COUNT(*)::INT
          FROM claims c
          JOIN user_policies up
            ON c.user_policy_id = up.id
          WHERE up.user_id = $1
        ) AS total_claims,

        (
          SELECT COUNT(*)::INT
          FROM claims c
          JOIN user_policies up
            ON c.user_policy_id = up.id
          WHERE up.user_id = $1
            AND c.claim_status = 'Pending'
        ) AS pending_claims,

        (
          SELECT COUNT(*)::INT
          FROM documents
          WHERE user_id = $1
        ) AS total_documents;
    `,
    [customerId]
  );

  return result.rows[0];
};

const getCustomerProfile = async (customerId) => {
  const result = await pool.query(
    `
      SELECT
        id,
        full_name,
        email,
        phone,
        date_of_birth,
        address,
        role,
        agent_id,
        created_at
      FROM users
      WHERE id = $1
        AND role = 'customer';
    `,
    [customerId]
  );

  return result.rows[0];
};

const getCustomerRecentPolicies = async (customerId) => {
  const result = await pool.query(
    `
      SELECT
        up.id,
        up.policy_id,
        up.nominee_name,
        up.purchase_date,
        up.next_premium_date,
        up.expiry_date,
        up.policy_status,
        p.policy_name,
        p.policy_type,
        p.premium_amount,
        p.coverage_amount,
        p.duration_months
      FROM user_policies up
      JOIN policies p
        ON up.policy_id = p.policy_id
      WHERE up.user_id = $1
      ORDER BY up.purchase_date DESC
      LIMIT 5;
    `,
    [customerId]
  );

  return result.rows;
};

const getCustomerNextPremium = async (customerId) => {
  const result = await pool.query(
    `
      SELECT
        up.id AS user_policy_id,
        up.next_premium_date,
        up.policy_status,
        p.policy_name,
        p.premium_amount
      FROM user_policies up
      JOIN policies p
        ON up.policy_id = p.policy_id
      WHERE up.user_id = $1
        AND up.next_premium_date IS NOT NULL
        AND up.next_premium_date >= CURRENT_DATE
        AND up.policy_status = 'Active'
      ORDER BY up.next_premium_date ASC
      LIMIT 1;
    `,
    [customerId]
  );

  return result.rows[0] || null;
};

const getCustomerPolicies = async (userId) => {
  const result = await pool.query(
    `
      SELECT
        up.id,
        p.policy_name,
        p.policy_type,
        p.coverage_amount,
        p.premium_amount,
        up.nominee_name,
        up.purchase_date,
        up.next_premium_date,
        up.expiry_date,
        up.policy_status
      FROM user_policies up
      JOIN policies p
        ON up.policy_id = p.policy_id
      WHERE up.user_id = $1
      ORDER BY up.purchase_date DESC
    `,
    [userId]
  );

  return result.rows;
};

module.exports = {
  getCustomerDashboardSummary,
  getCustomerProfile,
  getCustomerRecentPolicies,
  getCustomerNextPremium,
  getCustomerPolicies,
};
