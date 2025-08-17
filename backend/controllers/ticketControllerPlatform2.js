const Ticket = require('../models/ticketModel');

const getTickets = async (req, res) => {
    try {
       const tickets = await Ticket.find({ status: { $nin: ['Resolved', 'Not Resolved'] }   // exclude both
        }).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateTicketStatus = (io) => async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Open', 'Pending', 'Resolved','Not Resolved'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status provided.' });
        }

        const updatedTicket = await Ticket.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json(updatedTicket);

        // 💡 NEW: Emit a Socket.IO event to all clients
        io.emit('ticketUpdated', updatedTicket);

    } catch (error) {
        console.error('Error updating ticket status:', error);
        res.status(500).json({ message: 'Error updating ticket status' });
    }
};

module.exports = {
    getTickets,
    updateTicketStatus
};