const pool = require("../config/db");

const getDashboardSummary = async () => {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*)::INT FROM users) AS total_customers,

      (SELECT COUNT(*)::INT FROM policies) AS total_policies,

      (
        SELECT COUNT(*)::INT
        FROM user_policies
        WHERE policy_status = 'Active'
      ) AS active_policies,

      (
        SELECT COUNT(*)::INT
        FROM user_policies
        WHERE policy_status = 'Expired'
      ) AS expired_policies,

      (SELECT COUNT(*)::INT FROM claims) AS total_claims,

      (SELECT COUNT(*)::INT FROM documents) AS total_documents,

      (
        SELECT COALESCE(SUM(amount), 0)::NUMERIC(10, 2)
        FROM payments
        WHERE payment_status = 'Paid'
      ) AS total_premium_collected;
  `);

  return result.rows[0];
};

const getClaimStatistics = async () => {
  const result = await pool.query(`
    SELECT
      claim_status,
      COUNT(*)::INT AS total
    FROM claims
    GROUP BY claim_status
    ORDER BY claim_status;
  `);

  return result.rows;
};

const getPremiumCollection = async () => {
  const result = await pool.query(`
    SELECT
      payment_status,
      COALESCE(SUM(amount), 0)::NUMERIC(10,2) AS total_amount
    FROM payments
    GROUP BY payment_status
    ORDER BY payment_status;
  `);

  return result.rows;
};

const getCustomerGrowth = async () => {
  const result = await pool.query(`
    SELECT
    DATE_TRUNC('month', created_at) AS sort_date,
    TO_CHAR(DATE_TRUNC('month', created_at), 'Mon YYYY') AS month,
    COUNT(*)::INT AS total_customers
FROM users
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY sort_date;
  `);

  return result.rows;
};

const getMonthlyBusinessOverview = async () => {
  const result = await pool.query(`
    WITH monthly_customers AS (
      SELECT
        DATE_TRUNC('month', created_at) AS month,
        COUNT(*)::INT AS customers
      FROM users
      GROUP BY DATE_TRUNC('month', created_at)
    ),

    monthly_payments AS (
      SELECT
        DATE_TRUNC('month', payment_date) AS month,
        COALESCE(SUM(amount), 0)::NUMERIC(10,2) AS premium
      FROM payments
      WHERE payment_status = 'Paid'
      GROUP BY DATE_TRUNC('month', payment_date)
    ),

    monthly_claims AS (
      SELECT
        DATE_TRUNC('month', claim_date) AS month,
        COUNT(*)::INT AS claims
      FROM claims
      GROUP BY DATE_TRUNC('month', claim_date)
    )

    SELECT
      TO_CHAR(
        COALESCE(
          mc.month,
          mp.month,
          mcl.month
        ),
        'Mon YYYY'
      ) AS month,

      COALESCE(mc.customers, 0) AS customers,
      COALESCE(mp.premium, 0) AS premium,
      COALESCE(mcl.claims, 0) AS claims

    FROM monthly_customers mc

    FULL OUTER JOIN monthly_payments mp
      ON mc.month = mp.month

    FULL OUTER JOIN monthly_claims mcl
      ON COALESCE(mc.month, mp.month) = mcl.month

    ORDER BY
      COALESCE(
        mc.month,
        mp.month,
        mcl.month
      );
  `);

  return result.rows;
};

module.exports = {
  getDashboardSummary,
  getClaimStatistics,
  getPremiumCollection,
  getCustomerGrowth,
  getMonthlyBusinessOverview,
};
