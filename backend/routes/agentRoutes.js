import express from 'express';
import {
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
  getAssignedTickets,
  updateTicketStatus,
  assignTicketToAgent
} from '../controllers/agentController.js';
import { isAuthenticated } from '../Middlewares/auth.js'; // adjust if needed

const agentRouter = express.Router();

// ─── Agent CRUD Routes ────────────────────────────────────────
agentRouter.post('/', createAgent);               // Create new agent
agentRouter.get('/', getAllAgents);               // Get all agents
agentRouter.get('/:id', getAgentById);            // Get single agent by ID
agentRouter.put('/:id', updateAgent);             // Update agent
agentRouter.delete('/:id', deleteAgent);          // Delete agent

// ─── Ticket-Related Routes ─────────────────────────────────────
// Must be authenticated to fetch or update tickets
agentRouter.get('/tickets/assigned', isAuthenticated, getAssignedTickets);       // Tickets assigned to agent
agentRouter.put('/tickets/:ticketId/status', isAuthenticated, updateTicketStatus); // Update ticket status
agentRouter.post('/tickets/assign', assignTicketToAgent);                         // Assign ticket to agent

export default agentRouter;
