const pool = require("../config/db");

// Create Payment
const createPayment = async (
  user_policy_id,
  amount,
  payment_date,
  due_date,
  payment_method,
  payment_status
) => {
  const query = `
        INSERT INTO payments
        (
            user_policy_id,
            amount,
            payment_date,
            due_date,
            payment_method,
            payment_status
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;

  const values = [
    user_policy_id,
    amount,
    payment_date,
    due_date,
    payment_method,
    payment_status
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

// Get All Payments
const getAllPayments = async ({
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
        OR pol.policy_name ILIKE $${values.length}
        OR p.payment_method ILIKE $${values.length}
        OR CAST(p.amount AS TEXT) ILIKE $${values.length}
      )
    `);
  }

  if (status) {
    values.push(status);

    conditions.push(`
      p.payment_status = $${values.length}
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

  const countQuery = `
    SELECT COUNT(*) AS total_records
    FROM payments p

    JOIN user_policies up
      ON p.user_policy_id = up.id

    JOIN users u
      ON up.user_id = u.id

    JOIN policies pol
      ON up.policy_id = pol.policy_id

    ${whereClause};
  `;

  const countResult = await pool.query(
    countQuery,
    values
  );

  const totalRecords = Number(
    countResult.rows[0].total_records
  );

  const listValues = [...values, limit, offset];

  const limitPosition = listValues.length - 1;
  const offsetPosition = listValues.length;

  const paymentsQuery = `
    SELECT
      p.payment_id,
      p.amount,
      p.payment_date,
      p.due_date,
      p.payment_method,
      p.payment_status,

      up.id AS user_policy_id,

      u.full_name,
      u.email,

      pol.policy_name,
      pol.policy_type

    FROM payments p

    JOIN user_policies up
      ON p.user_policy_id = up.id

    JOIN users u
      ON up.user_id = u.id

    JOIN policies pol
      ON up.policy_id = pol.policy_id

    ${whereClause}

    ORDER BY p.payment_id DESC

    LIMIT $${limitPosition}
    OFFSET $${offsetPosition};
  `;

  const result = await pool.query(
    paymentsQuery,
    listValues
  );

  return {
    payments: result.rows,
    totalRecords
  };
};

// Get Payment By ID
const getPaymentById = async (
  paymentId,
  role,
  userId
) => {
  const values = [paymentId];
  const conditions = ["p.payment_id = $1"];

  if (role === "agent") {
    values.push(userId);

    conditions.push(
      `u.agent_id = $${values.length}`
    );
  }

  const result = await pool.query(
    `
      SELECT
        p.payment_id,
        p.user_policy_id,
        p.amount,
        p.payment_date,
        p.due_date,
        p.payment_method,
        p.payment_status,

        u.full_name,
        u.email,

        pol.policy_name,
        pol.policy_type

      FROM payments p

      JOIN user_policies up
        ON p.user_policy_id = up.id

      JOIN users u
        ON up.user_id = u.id

      JOIN policies pol
        ON up.policy_id = pol.policy_id

      WHERE ${conditions.join(" AND ")};
    `,
    values
  );

  return result.rows[0] || null;
};

// Update Payment
const updatePayment = async (
  payment_id,
  user_policy_id,
  amount,
  payment_date,
  due_date,
  payment_method,
  payment_status
) => {
  const result = await pool.query(
    `
        UPDATE payments
        SET
            user_policy_id = $1,
            amount = $2,
            payment_date = $3,
            due_date = $4,
            payment_method = $5,
            payment_status = $6
        WHERE payment_id = $7
        RETURNING *;
        `,
    [
      user_policy_id,
      amount,
      payment_date,
      due_date,
      payment_method,
      payment_status,
      payment_id
    ]
  );

  return result.rows[0];
};

// Delete Payment
const deletePayment = async (payment_id) => {
  const result = await pool.query(
    `
        DELETE FROM payments
        WHERE payment_id = $1
        RETURNING *;
        `,
    [payment_id]
  );

  return result.rows[0];
};

// Get logged-in customer's payments
const getCustomerPayments = async (customerId) => {
  const result = await pool.query(
    `
      SELECT
        p.payment_id,
        p.amount,
        p.payment_date,
        p.due_date,
        p.payment_method,
        p.payment_status,

        up.id AS user_policy_id,

        pol.policy_name,
        pol.policy_type

      FROM payments p

      JOIN user_policies up
        ON p.user_policy_id = up.id

      JOIN policies pol
        ON up.policy_id = pol.policy_id

      WHERE up.user_id = $1

      ORDER BY p.payment_date DESC, p.payment_id DESC;
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
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getCustomerPayments,
  checkUserPolicyBelongsToAgent,
};
