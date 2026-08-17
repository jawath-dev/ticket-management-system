const pool = require("../database/db");

async function getStatusCounts() {
  const [rows] = await pool.query(
    "SELECT status, COUNT(*) AS count FROM tickets GROUP BY status",
  );
  return rows;
}

async function getPriorityCounts() {
  const [rows] = await pool.query(
    "SELECT priority, COUNT(*) AS count FROM tickets GROUP BY priority",
  );
  return rows;
}

async function getCategoryCounts() {
  const [rows] = await pool.query(
    `SELECT cat.name AS category, COUNT(*) AS count
     FROM tickets t
     LEFT JOIN categories cat ON t.category_id = cat.id
     GROUP BY cat.name`,
  );
  return rows;
}

async function getOverdueCount() {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count FROM tickets WHERE due_date < NOW() AND status NOT IN ('RESOLVED', 'CLOSED')`,
  );
  return rows[0].count;
}

async function getTotalCount() {
  const [rows] = await pool.query("SELECT COUNT(*) AS count FROM tickets");
  return rows[0].count;
}

module.exports = {
  getStatusCounts,
  getPriorityCounts,
  getCategoryCounts,
  getOverdueCount,
  getTotalCount,
};
