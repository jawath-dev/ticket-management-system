const pool = require("../database/db");

async function getAllCategories() {
  const [rows] = await pool.query(
    "SELECT id, name FROM categories ORDER BY name",
  );
  return rows;
}

module.exports = { getAllCategories };
