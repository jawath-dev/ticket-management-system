const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const commentController = require("../controllers/commentController");

router.get("/", ticketController.getTickets);
router.get("/:id", ticketController.getTicketById);
router.post("/", ticketController.createTicket);
router.put("/:id", ticketController.updateTicket);
router.put("/:id/status", ticketController.updateStatus);
router.put("/:id/assignment", ticketController.updateAssignment);
router.delete("/:id", ticketController.deleteTicket);
router.get("/:id/comments", commentController.getComments);
router.post("/:id/comments", commentController.createComment);
router.get("/:id/history", ticketController.getStatusHistory);

module.exports = router;
