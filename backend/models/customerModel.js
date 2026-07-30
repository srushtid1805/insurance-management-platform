const pool = require("../config/db");

// Get all customers
const getAllCustomers = async ({
  search = "",
  page = 1,
  limit = 5,
}) => {
  const offset = (page - 1) * limit;
  const searchValue = `%${search}%`;

  const customersResult = await pool.query(
    `
      SELECT *
      FROM users
      WHERE
        full_name ILIKE $1
        OR email ILIKE $1
        OR phone ILIKE $1
      ORDER BY created_at DESC
      LIMIT $2
      OFFSET $3
    `,
    [searchValue, limit, offset]
  );

  const countResult = await pool.query(
    `
      SELECT COUNT(*)::INT AS total
      FROM users
      WHERE
        full_name ILIKE $1
        OR email ILIKE $1
        OR phone ILIKE $1
    `,
    [searchValue]
  );

  return {
    customers: customersResult.rows,
    totalRecords: countResult.rows[0].total,
  };
};
// Get customer by ID
const getCustomerById = async (id) => {
    const query = `
        SELECT
            id,
            full_name,
            email,
            phone,
            date_of_birth,
            address,
            created_at
        FROM users
        WHERE id = $1;
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
};

// Update customer
const updateCustomer = async(
    id,
    full_name,
    email,
    phone,
    date_of_birth,
    address
) => {
    const query = `
        UPDATE users
        SET 
            full_name = $1,
            email = $2,
            phone = $3,
            date_of_birth = $4,
            address = $5
        WHERE id = $6
        RETURNING *
    `;

    const values = [
        full_name,
        email,
        phone,
        date_of_birth,
        address,
        id,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};

// Delete customer
const deleteCustomer = async(id) => {
    const query = `
        DELETE FROM users
        WHERE id = $1
        RETURNING
            id,
            full_name,
            email,
            phone,
            date_of_birth,
            address,
            created_at;
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
};