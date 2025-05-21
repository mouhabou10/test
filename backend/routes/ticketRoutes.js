// TicketRoutes.js
import { Router } from 'express';
import {
  createTicket,
  getTicketStatus,
  incrementPassedTickets,
  pauseTicketDemand,
  resetDay,
  getTicketStats
} from '../controllers/ticketController.js';

const ticketRouter = Router();

ticketRouter.get('/stats', getTicketStats);
ticketRouter.post('/create', createTicket);
ticketRouter.get('/status/:id', getTicketStatus);
ticketRouter.post('/next/:id', incrementPassedTickets);
ticketRouter.post('/pause/:id', pauseTicketDemand);
ticketRouter.post('/reset/:id', resetDay);

export default ticketRouter;
