const pool = require("../config/db");

// Get customers with search and pagination
const getAllCustomers = async ({
  search = "",
  page = 1,
  limit = 5,
  role,
  userId
}) => {
  const offset = (page - 1) * limit;
  const searchValue = `%${search}%`;

  const values = [searchValue];
  const conditions = [
    "role = 'customer'",
    `(
      full_name ILIKE $1
      OR email ILIKE $1
      OR phone ILIKE $1
      OR COALESCE(address, '') ILIKE $1
    )`
  ];

  if (role === "agent") {
    values.push(userId);
    conditions.push(`agent_id = $${values.length}`);
  }

  const whereClause = `WHERE ${conditions.join(" AND ")}`;

  const listValues = [...values, limit, offset];

  const customersResult = await pool.query(
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
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${listValues.length - 1}
      OFFSET $${listValues.length};
    `,
    listValues
  );

  const countResult = await pool.query(
    `
      SELECT COUNT(*)::INT AS total_records
      FROM users
      ${whereClause};
    `,
    values
  );

  return {
    customers: customersResult.rows,
    totalRecords: countResult.rows[0].total_records
  };
};

// Get one customer by ID
const getCustomerById = async (id, role, userId) => {
  const values = [id];
  const conditions = ["id = $1", "role = 'customer'"];

  if (role === "agent") {
    values.push(userId);
    conditions.push(`agent_id = $${values.length}`);
  }

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
      WHERE ${conditions.join(" AND ")};
    `,
    values
  );

  return result.rows[0] || null;
};

// Update customer details
const updateCustomer = async (
  id,
  fullName,
  email,
  phone,
  dateOfBirth,
  address
) => {
  const result = await pool.query(
    `
      UPDATE users
      SET
        full_name = $1,
        email = $2,
        phone = $3,
        date_of_birth = $4,
        address = $5
      WHERE id = $6
        AND role = 'customer'
      RETURNING
        id,
        full_name,
        email,
        phone,
        date_of_birth,
        address,
        role,
        agent_id,
        created_at;
    `,
    [fullName, email, phone, dateOfBirth, address, id]
  );

  return result.rows[0] || null;
};

// Delete customer
const deleteCustomer = async (id) => {
  const result = await pool.query(
    `
      DELETE FROM users
      WHERE id = $1
        AND role = 'customer'
      RETURNING
        id,
        full_name,
        email,
        phone,
        date_of_birth,
        address,
        role,
        agent_id,
        created_at;
    `,
    [id]
  );

  return result.rows[0] || null;
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
};
