const express = require('express');
const { getTickets, updateTicketStatus } = require('../controllers/ticketControllerPlatform2'); // Rename controller import

module.exports = (io) => {
  const router = express.Router();

  router.get('/', getTickets); // No real-time update needed on fetch
  router.patch('/:id/status', updateTicketStatus(io)); // Pass io for the status update

  return router;
};