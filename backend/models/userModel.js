const pool = require("../config/db");

// Create a new user
const createUser = async (
    full_name,
    email,
    phone,
    password,
    date_of_birth,
    address
) => {
    const query = `
        INSERT INTO users
        (full_name, email, phone, password, date_of_birth, address)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;

    const values = [
        full_name,
        email,
        phone,
        password,
        date_of_birth,
        address,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};

// Find user by email
const findUserByEmail = async (email) => {
    const query =`
        SELECT * FROM users
        WHERE email = $1;
    `;

    const result = await pool.query(query, [email]);
    return result.rows[0];
};
 
// Find user by phone
const findUserByPhone = async (phone) => {
    const query = `
        SELECT * FROM users
        WHERE phone = $1;
    `;

    const result = await pool.query(query, [phone]);
    return result.rows[0];
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserByPhone,
};