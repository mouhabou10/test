// TicketRoutes.js
import { Router } from 'express';
import Ticket from '../models/ticket.model.js';
import {
  createTicket,
  getTicketStatus,
  incrementPassedTickets,
  pauseTicketDemand,
  resetDay,
  getTicketStats,
  checkExistingTicket
} from '../controllers/ticketController.js';

const ticketRouter = Router();

ticketRouter.get('/stats', getTicketStats);
ticketRouter.post('/create', createTicket);
ticketRouter.get('/status/:id', getTicketStatus);
ticketRouter.post('/next/:id', incrementPassedTickets);
ticketRouter.post('/pause/:id', pauseTicketDemand);
ticketRouter.post('/reset/:id', resetDay);

// Check if a ticket already exists for a client and service provider
ticketRouter.get('/check', checkExistingTicket);

// Get a specific ticket by ID
ticketRouter.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('serviceProvider');
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ticket',
      error: error.message
    });
  }
});

export default ticketRouter;
