const pool = require("../database/db");

async function getAllUsers() {
  const [rows] = await pool.query(
    "SELECT id, name, email, role FROM users ORDER BY name",
  );
  return rows;
}

module.exports = { getAllUsers };
