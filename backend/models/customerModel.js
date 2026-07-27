const pool = require("../config/db");

// Get all customers
const getAllCustomers = async () => {
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
        ORDER BY id;
    `;

    const result = await pool.query(query);
    return result.rows;
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