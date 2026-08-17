const pool = require("../database/db");

async function getCommentsByTicketId(ticketId) {
  const [rows] = await pool.query(
    `SELECT tc.id, tc.comment, tc.created_at, u.name AS user_name
     FROM ticket_comments tc
     LEFT JOIN users u ON tc.user_id = u.id
     WHERE tc.ticket_id = ?
     ORDER BY tc.created_at ASC`,
    [ticketId],
  );
  return rows;
}

async function addComment(ticketId, userId, comment) {
  const [result] = await pool.query(
    "INSERT INTO ticket_comments (ticket_id, user_id, comment) VALUES (?, ?, ?)",
    [ticketId, userId, comment],
  );
  return result.insertId;
}

module.exports = { getCommentsByTicketId, addComment };
