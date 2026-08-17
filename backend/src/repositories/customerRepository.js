const pool = require("../database/db");

async function getAllCustomers() {
  const [rows] = await pool.query(
    "SELECT id, name, email, phone FROM customers ORDER BY name",
  );
  return rows;
}

async function getCustomerById(id) {
  const [rows] = await pool.query(
    "SELECT id, name, email, phone FROM customers WHERE id = ?",
    [id],
  );
  return rows[0];
}

module.exports = { getAllCustomers, getCustomerById };
