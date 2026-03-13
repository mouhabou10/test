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
// ticketRoutes.js - Update routes


ticketRouter.get('/stats', getTicketStats);
ticketRouter.post('/create', createTicket);
ticketRouter.get('/status/:id', getTicketStatus);
// Remove :id parameter since we pass data in body
ticketRouter.post('/next', incrementPassedTickets); 
ticketRouter.post('/pause', pauseTicketDemand);
ticketRouter.post('/resume', pauseTicketDemand);
ticketRouter.post('/reset', resetDay);
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
