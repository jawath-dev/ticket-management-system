const ticketService = require("../services/ticketService");
const ticketRepository = require("../repositories/ticketRepository");
const ticketValidator = require("../validators/ticketValidator");

async function getTickets(req, res, next) {
  try {
    const result = await ticketService.listTickets(req.query);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
}

async function getTicketById(req, res, next) {
  try {
    const ticket = await ticketRepository.getTicketById(req.params.id);

    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
}

async function createTicket(req, res, next) {
  try {
    const errors = await ticketValidator.validateCreateTicket(req.body);

    if (errors.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: errors.join(", ") });
    }

    const ticket = await ticketService.createNewTicket(req.body);
    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    const ticket = await ticketService.updateStatus(req.params.id, status);
    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
}

async function updateAssignment(req, res, next) {
  try {
    const { agentId } = req.body;
    const ticket = await ticketService.updateAssignment(
      req.params.id,
      agentId || null,
    );
    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
}

async function updateTicket(req, res, next) {
  try {
    const errors = ticketValidator.validateCreateTicket(req.body);

    if (errors.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: errors.join(", ") });
    }

    const ticket = await ticketService.updateExistingTicket(
      req.params.id,
      req.body,
    );
    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
}

async function getStatusHistory(req, res, next) {
  try {
    const history = await ticketRepository.getStatusHistory(req.params.id);
    res.status(200).json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
}

async function deleteTicket(req, res, next) {
  try {
    await ticketService.deleteExistingTicket(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Ticket deleted successfully" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  updateStatus,
  updateAssignment,
  getStatusHistory,
};
