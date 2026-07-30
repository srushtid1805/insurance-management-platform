const pool = require("../config/db");

const createUserPolicy = async (
    user_id,
    policy_id,
    nominee_name,
    purchase_date,
    next_premium_date,
    expiry_date,
    policy_status
) => {
    const query = `
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
    `;

    const values = [
        user_id,
        policy_id,
        nominee_name,
        purchase_date,
        next_premium_date,
        expiry_date,
        policy_status,
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};

const getAllUserPolicies = async ({
    search = "",
    status = "",
    page = 1,
    limit = 5,
}) => {
    const offset = (page - 1) * limit;
    const searchValue = `%${search}%`;

    let query = `
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
        WHERE (
            u.full_name ILIKE $1
            OR u.email ILIKE $1
            OR p.policy_name ILIKE $1
            OR p.policy_type ILIKE $1
            OR up.nominee_name ILIKE $1
        )
    `;

    let countQuery = `
        SELECT COUNT(*)::INT AS total
        FROM user_policies up
        JOIN users u
            ON up.user_id = u.id
        JOIN policies p
            ON up.policy_id = p.policy_id
        WHERE (
            u.full_name ILIKE $1
            OR u.email ILIKE $1
            OR p.policy_name ILIKE $1
            OR p.policy_type ILIKE $1
            OR up.nominee_name ILIKE $1
        )
    `;

    const params = [searchValue];
    const countParams = [searchValue];

    if (status) {
        query += ` AND up.policy_status = $2`;
        countQuery += ` AND up.policy_status = $2`;

        params.push(status);
        countParams.push(status);
    }

    query += `
        ORDER BY up.id DESC
        LIMIT $${params.length + 1}
        OFFSET $${params.length + 2};
    `;

    params.push(limit);
    params.push(offset);

    const policiesResult = await pool.query(query, params);

    const countResult = await pool.query(
        countQuery,
        countParams
    );

    return {
        userPolicies: policiesResult.rows,
        totalRecords: countResult.rows[0].total,
    };
};

const getUserPolicyById = async (id) => {
    const query = `
        SELECT
            up.id,
            up.user_id,
            u.full_name AS customer_name,
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
        WHERE up.id = $1;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];
};

const updateUserPolicy = async (
    id,
    user_id,
    policy_id,
    nominee_name,
    purchase_date,
    next_premium_date,
    expiry_date,
    policy_status
) => {
    const query = `
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
    `;

    const values = [
        user_id,
        policy_id,
        nominee_name,
        purchase_date,
        next_premium_date,
        expiry_date,
        policy_status,
        id,
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};

const deleteUserPolicy = async (id) => {
    const query = `
        DELETE FROM user_policies
        WHERE id = $1
        RETURNING *;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];
};

module.exports = {
    createUserPolicy,
    getAllUserPolicies,
    getUserPolicyById,
    updateUserPolicy,
    deleteUserPolicy,
};