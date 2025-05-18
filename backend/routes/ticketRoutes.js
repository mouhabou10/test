// TicketRoutes.js
import { Router } from 'express';
import {
  createTicket,
  getTicketStatus,
  incrementPassedTickets,
  pauseTicketDemand,
  resetDay,
} from '../controllers/ticketController.js';
import { isAuthenticated } from '../Middlewares/auth.js';

const ticketRouter = Router();

ticketRouter.post('/create', isAuthenticated, createTicket);
ticketRouter.get('/status/:id', isAuthenticated, getTicketStatus);
ticketRouter.post('/next/:id', isAuthenticated, incrementPassedTickets);
ticketRouter.post('/pause/:id', isAuthenticated, pauseTicketDemand);
ticketRouter.post('/reset/:id', isAuthenticated, resetDay);

export default ticketRouter;
