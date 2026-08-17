const pool = require("../database/db");

async function getTickets(filters) {
  const {
    page,
    limit,
    search,
    status,
    priority,
    category,
    agentId,
    sortBy,
    sortOrder,
  } = filters;

  let conditions = [];
  let params = [];

  if (search) {
    conditions.push("(t.subject LIKE ? OR c.name LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  if (status) {
    conditions.push("t.status = ?");
    params.push(status);
  }

  if (priority) {
    conditions.push("t.priority = ?");
    params.push(priority);
  }

  if (category) {
    conditions.push("t.category_id = ?");
    params.push(category);
  }

  if (agentId) {
    conditions.push("t.agent_id = ?");
    params.push(agentId);
  }

  const whereClause = conditions.length
    ? "WHERE " + conditions.join(" AND ")
    : "";

  const sortFieldMap = {
    createdAt: "t.created_at",
    dueDate: "t.due_date",
    priority: "t.priority",
  };
  const sortColumn = sortFieldMap[sortBy] || "t.created_at";
  const order = sortOrder === "asc" ? "ASC" : "DESC";

  const offset = (page - 1) * limit;

  const dataQuery = `
    SELECT t.id, t.subject, t.priority, t.status, t.due_date, t.created_at,
           c.name AS customer_name,
           u.name AS agent_name,
           cat.name AS category_name
    FROM tickets t
    LEFT JOIN customers c ON t.customer_id = c.id
    LEFT JOIN users u ON t.agent_id = u.id
    LEFT JOIN categories cat ON t.category_id = cat.id
    ${whereClause}
    ORDER BY ${sortColumn} ${order}
    LIMIT ? OFFSET ?
  `;

  const [rows] = await pool.query(dataQuery, [
    ...params,
    Number(limit),
    Number(offset),
  ]);

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM tickets t
    LEFT JOIN customers c ON t.customer_id = c.id
    ${whereClause}
  `;

  const [countResult] = await pool.query(countQuery, params);
  const total = countResult[0].total;

  return { rows, total };
}

async function getTicketById(id) {
  const [rows] = await pool.query(
    `SELECT t.*, c.name AS customer_name, u.name AS agent_name, cat.name AS category_name
     FROM tickets t
     LEFT JOIN customers c ON t.customer_id = c.id
     LEFT JOIN users u ON t.agent_id = u.id
     LEFT JOIN categories cat ON t.category_id = cat.id
     WHERE t.id = ?`,
    [id],
  );
  return rows[0];
}

async function createTicket(ticket) {
  const { subject, description, customerId, categoryId, priority, dueDate } =
    ticket;
  const [result] = await pool.query(
    `INSERT INTO tickets (subject, description, customer_id, category_id, priority, status, due_date)
     VALUES (?, ?, ?, ?, ?, 'OPEN', ?)`,
    [subject, description, customerId, categoryId, priority, dueDate],
  );
  return result.insertId;
}

async function updateTicketStatus(id, status) {
  await pool.query("UPDATE tickets SET status = ? WHERE id = ?", [status, id]);
}

async function addStatusHistory(ticketId, oldStatus, newStatus) {
  await pool.query(
    "INSERT INTO ticket_status_history (ticket_id, old_status, new_status) VALUES (?, ?, ?)",
    [ticketId, oldStatus, newStatus],
  );
}

async function updateAssignment(id, agentId) {
  await pool.query("UPDATE tickets SET agent_id = ? WHERE id = ?", [
    agentId,
    id,
  ]);
}

async function updateTicket(id, ticket) {
  const { subject, description, customerId, categoryId, priority } = ticket;
  await pool.query(
    `UPDATE tickets SET subject = ?, description = ?, customer_id = ?, category_id = ?, priority = ? WHERE id = ?`,
    [subject, description, customerId, categoryId, priority, id],
  );
}

async function getStatusHistory(ticketId) {
  const [rows] = await pool.query(
    `SELECT sh.id, sh.old_status, sh.new_status, sh.changed_at, u.name AS changed_by_name
     FROM ticket_status_history sh
     LEFT JOIN users u ON sh.changed_by = u.id
     WHERE sh.ticket_id = ?
     ORDER BY sh.changed_at ASC`,
    [ticketId],
  );
  return rows;
}

async function deleteTicket(id) {
  await pool.query("DELETE FROM tickets WHERE id = ?", [id]);
}

module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicketStatus,
  addStatusHistory,
  updateAssignment,
  updateTicket,
  getStatusHistory,
  deleteTicket,
};
