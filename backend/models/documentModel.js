const pool = require("../config/db");

// Upload Document
const createDocument = async (
  user_id,
  document_type,
  document_path,
  verification_status
) => {
  const result = await pool.query(
    `
      INSERT INTO documents
      (
        user_id,
        document_type,
        document_path,
        verification_status
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `,
    [
      user_id,
      document_type,
      document_path,
      verification_status,
    ]
  );

  return result.rows[0];
};

// Get All Documents
const getAllDocuments = async ({
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
        OR u.email ILIKE $${values.length}
        OR d.document_type ILIKE $${values.length}
        OR d.document_path ILIKE $${values.length}
      )
    `);
  }

  if (status) {
    values.push(status);

    conditions.push(`
      d.verification_status = $${values.length}
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

  const countResult = await pool.query(
    `
      SELECT COUNT(*) AS total_records
      FROM documents d

      JOIN users u
        ON d.user_id = u.id

      ${whereClause};
    `,
    values
  );

  const totalRecords = Number(
    countResult.rows[0].total_records
  );

  const listValues = [...values, limit, offset];
  const limitPosition = listValues.length - 1;
  const offsetPosition = listValues.length;

  const result = await pool.query(
    `
      SELECT
        d.document_id,
        d.user_id,

        u.full_name,
        u.email,

        d.document_type,
        d.document_path,
        d.verification_status,
        d.uploaded_at

      FROM documents d

      JOIN users u
        ON d.user_id = u.id

      ${whereClause}

      ORDER BY d.document_id DESC

      LIMIT $${limitPosition}
      OFFSET $${offsetPosition};
    `,
    listValues
  );

  return {
    documents: result.rows,
    totalRecords
  };
};

// Get Document By ID
const getDocumentById = async (
  documentId,
  role,
  userId
) => {
  const values = [documentId];
  const conditions = ["d.document_id = $1"];

  if (role === "agent") {
    values.push(userId);

    conditions.push(`
      u.agent_id = $${values.length}
    `);
  }

  const result = await pool.query(
    `
      SELECT
        d.document_id,
        d.user_id,
        d.document_type,
        d.document_path,
        d.verification_status,
        d.uploaded_at,

        u.full_name,
        u.email

      FROM documents d

      JOIN users u
        ON d.user_id = u.id

      WHERE ${conditions.join(" AND ")};
    `,
    values
  );

  return result.rows[0] || null;
};

// Update Verification Status
const updateDocument = async (
  document_id,
  user_id,
  document_type,
  document_path,
  verification_status
) => {
  const result = await pool.query(
    `
      UPDATE documents
      SET
        user_id = $1,
        document_type = $2,
        document_path = $3,
        verification_status = $4
      WHERE document_id = $5
      RETURNING *;
    `,
    [
      user_id,
      document_type,
      document_path,
      verification_status,
      document_id,
    ]
  );

  return result.rows[0];
};

// Delete Document
const deleteDocument = async (document_id) => {
  const result = await pool.query(
    `
      DELETE FROM documents
      WHERE document_id = $1
      RETURNING *;
    `,
    [document_id]
  );

  return result.rows[0];
};

// Get logged-in customer's documents
const getCustomerDocuments = async (customerId) => {
  const result = await pool.query(
    `
      SELECT
        document_id,
        user_id,
        document_type,
        document_path,
        verification_status,
        uploaded_at
      FROM documents
      WHERE user_id = $1
      ORDER BY uploaded_at DESC, document_id DESC;
    `,
    [customerId]
  );

  return result.rows;
};

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

module.exports = {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  getCustomerDocuments,
  checkCustomerBelongsToAgent,
};