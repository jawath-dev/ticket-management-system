const pool = require("../database/db");

async function getAllUsers() {
  const [rows] = await pool.query(
    "SELECT id, name, email, role FROM users ORDER BY name",
  );
  return rows;
}

async function getUserById(id) {
  const [rows] = await pool.query(
    "SELECT id, name, email, role FROM users WHERE id = ?",
    [id],
  );
  return rows[0];
}

async function createUser(user) {
  const { name, email, role } = user;
  const [result] = await pool.query(
    "INSERT INTO users (name, email, role) VALUES (?, ?, ?)",
    [name, email, role || "agent"],
  );
  return result.insertId;
}

async function updateUser(id, user) {
  const { name, email } = user;
  await pool.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [
    name,
    email,
    id,
  ]);
}

async function deleteUser(id) {
  await pool.query("DELETE FROM users WHERE id = ?", [id]);
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
