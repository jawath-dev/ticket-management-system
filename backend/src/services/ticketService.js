const ticketRepository = require("../repositories/ticketRepository");

const slaHours = {
  LOW: 72,
  MEDIUM: 48,
  HIGH: 24,
  URGENT: 8,
};

const allowedTransitions = {
  OPEN: ["IN_PROGRESS"],
  IN_PROGRESS: ["WAITING_FOR_CUSTOMER", "RESOLVED"],
  WAITING_FOR_CUSTOMER: ["IN_PROGRESS"],
  RESOLVED: ["CLOSED"],
  CLOSED: [],
};

function calculateDueDate(priority) {
  const hours = slaHours[priority];
  const dueDate = new Date();
  dueDate.setHours(dueDate.getHours() + hours);
  return dueDate;
}

async function listTickets(query) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const filters = {
    page,
    limit,
    search: query.search,
    status: query.status,
    priority: query.priority,
    category: query.category,
    agentId: query.agent,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  };

  const { rows, total } = await ticketRepository.getTickets(filters);

  return {
    data: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function createNewTicket(body) {
  const dueDate = calculateDueDate(body.priority);

  const ticketId = await ticketRepository.createTicket({
    subject: body.subject,
    description: body.description,
    customerId: body.customerId,
    categoryId: body.categoryId,
    priority: body.priority,
    dueDate,
  });

  return ticketRepository.getTicketById(ticketId);
}

async function updateStatus(ticketId, newStatus) {
  const ticket = await ticketRepository.getTicketById(ticketId);

  if (!ticket) {
    const error = new Error("Ticket not found");
    error.statusCode = 404;
    throw error;
  }

  const currentStatus = ticket.status;
  const allowedNext = allowedTransitions[currentStatus];

  if (!allowedNext.includes(newStatus)) {
    const error = new Error(
      `Cannot change status from ${currentStatus} to ${newStatus}`,
    );
    error.statusCode = 409;
    throw error;
  }

  await ticketRepository.updateTicketStatus(ticketId, newStatus);
  await ticketRepository.addStatusHistory(ticketId, currentStatus, newStatus);

  return ticketRepository.getTicketById(ticketId);
}

async function updateAssignment(ticketId, agentId) {
  const ticket = await ticketRepository.getTicketById(ticketId);

  if (!ticket) {
    const error = new Error("Ticket not found");
    error.statusCode = 404;
    throw error;
  }

  if (ticket.status === "CLOSED") {
    const error = new Error("Cannot change assignment on a closed ticket");
    error.statusCode = 409;
    throw error;
  }

  await ticketRepository.updateAssignment(ticketId, agentId);
  return ticketRepository.getTicketById(ticketId);
}

async function updateExistingTicket(ticketId, body) {
  const ticket = await ticketRepository.getTicketById(ticketId);

  if (!ticket) {
    const error = new Error("Ticket not found");
    error.statusCode = 404;
    throw error;
  }

  if (ticket.status === "CLOSED") {
    const error = new Error("Cannot edit a closed ticket");
    error.statusCode = 409;
    throw error;
  }

  await ticketRepository.updateTicket(ticketId, {
    subject: body.subject,
    description: body.description,
    customerId: body.customerId,
    categoryId: body.categoryId,
    priority: body.priority,
  });

  return ticketRepository.getTicketById(ticketId);
}

async function deleteExistingTicket(ticketId) {
  const ticket = await ticketRepository.getTicketById(ticketId);

  if (!ticket) {
    const error = new Error("Ticket not found");
    error.statusCode = 404;
    throw error;
  }

  await ticketRepository.deleteTicket(ticketId);
}

module.exports = {
  listTickets,
  createNewTicket,
  calculateDueDate,
  updateStatus,
  updateAssignment,
  updateExistingTicket,
  deleteExistingTicket,
};
