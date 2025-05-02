import Ticket from '../models/Ticket.js';
import User from '../models/User.js'; // In case needed
import { validationResult } from 'express-validator';

// Get all tickets assigned to the agent
export const getAssignedTickets = async (req, res, next) => {
  try {
    const agentId = req.user.id; // Assuming authenticated agent
    const tickets = await Ticket.find({ assignedTo: agentId });

    res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

// Update ticket status (e.g., processing, done, rejected)
export const updateTicketStatus = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    ticket.status = status;
    await ticket.save();

    res.status(200).json({
      success: true,
      message: 'Ticket status updated',
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

// Optionally: assign a new ticket to an agent (for department chef)
export const assignTicketToAgent = async (req, res, next) => {
  try {
    const { ticketId, agentId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    ticket.assignedTo = agentId;
    await ticket.save();

    res.status(200).json({
      success: true,
      message: 'Ticket assigned to agent',
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};
