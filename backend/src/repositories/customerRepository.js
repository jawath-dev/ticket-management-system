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

async function createCustomer(customer) {
  const { name, email, phone } = customer;
  const [result] = await pool.query(
    "INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)",
    [name, email, phone || null],
  );
  return result.insertId;
}

async function updateCustomer(id, customer) {
  const { name, email, phone } = customer;
  await pool.query(
    "UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?",
    [name, email, phone || null, id],
  );
}

async function deleteCustomer(id) {
  await pool.query("DELETE FROM customers WHERE id = ?", [id]);
}

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
