const express = require("express");
const { 
  createTicket, 
  getAllTicketsUser, 
  deleteTicket, 
  changeStatusToNotResolved, 
  changeStatusToResolved 
} = require("../controllers/ticketControllerPlatoform1"); // Rename controller import

module.exports = (io) => {
  const router = express.Router();

  // Pass io to the createTicket controller
  router.post("/tickets/submit", createTicket(io));
  
  // Other routes can remain as is, since they don't trigger real-time updates
  router.get("/tickets/getAllTicketsUser", getAllTicketsUser);
  router.delete("/tickets/delete/:id", deleteTicket(io));
  router.put("/tickets/changeStatusToNotResolved/:id", changeStatusToNotResolved(io));
  router.put("/tickets/changeStatusToResolved/:id", changeStatusToResolved(io));

  return router;
};