const pool = require("../database/db");

async function validateCreateTicket(data) {
  const errors = [];

  if (!data.subject || data.subject.trim() === "") {
    errors.push("Subject is required");
  }

  if (!data.description || data.description.trim() === "") {
    errors.push("Description is required");
  }

  const validPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
  if (!validPriorities.includes(data.priority)) {
    errors.push("Priority must be LOW, MEDIUM, HIGH or URGENT");
  }

  if (!data.customerId) {
    errors.push("Customer is required");
  } else {
    const [rows] = await pool.query("SELECT id FROM customers WHERE id = ?", [
      data.customerId,
    ]);
    if (rows.length === 0) {
      errors.push("Customer does not exist");
    }
  }

  if (!data.categoryId) {
    errors.push("Category is required");
  } else {
    const [rows] = await pool.query("SELECT id FROM categories WHERE id = ?", [
      data.categoryId,
    ]);
    if (rows.length === 0) {
      errors.push("Category does not exist");
    }
  }

  return errors;
}

module.exports = { validateCreateTicket };
