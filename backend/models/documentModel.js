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
}) => {
  const offset = (page - 1) * limit;

  const values = [];
  const conditions = [];

  // Search
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

  // Verification status filter
  if (status) {
    values.push(status);

    conditions.push(`
      d.verification_status = $${values.length}
    `);
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

  // Count total matching records
  const countQuery = `
    SELECT COUNT(*) AS total_records

    FROM documents d

    JOIN users u
      ON d.user_id = u.id

    ${whereClause};
  `;

  const countResult = await pool.query(countQuery, values);

  const totalRecords = Number(
    countResult.rows[0].total_records
  );

  // Add pagination values
  values.push(limit);
  const limitPosition = values.length;

  values.push(offset);
  const offsetPosition = values.length;

  // Fetch paginated documents
  const documentsQuery = `
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
  `;

  const result = await pool.query(
    documentsQuery,
    values
  );

  return {
    documents: result.rows,
    totalRecords,
  };
};

// Get Document By ID
const getDocumentById = async (document_id) => {
  const result = await pool.query(
    `
      SELECT *
      FROM documents
      WHERE document_id = $1;
    `,
    [document_id]
  );

  return result.rows[0];
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

module.exports = {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
};