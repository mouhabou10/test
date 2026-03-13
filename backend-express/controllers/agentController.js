import Ticket from '../models/ticket.model.js';
import User from '../models/user.model.js';
import { validationResult } from 'express-validator';

// ─── TICKET OPERATIONS ──────────────────────────────────────────────────────

// ✅ Get all tickets assigned to the authenticated agent
export const getAssignedTickets = async (req, res, next) => {
  try {
    const agentId = req.user.id;
    const tickets = await Ticket.find({ assignedTo: agentId });
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    next(error);
  }
};

// ✅ Update the status of a ticket
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

    res.status(200).json({ success: true, message: 'Ticket status updated', data: ticket });
  } catch (error) {
    next(error);
  }
};

// ✅ Assign a ticket to an agent
export const assignTicketToAgent = async (req, res, next) => {
  try {
    const { ticketId, agentId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const agent = await User.findById(agentId);
    if (!agent || !['laboAgent', 'radioAgent', 'consultation agent'].includes(agent.role)) {
      return res.status(400).json({ success: false, message: 'Invalid agent' });
    }

    ticket.assignedTo = agentId;
    await ticket.save();

    res.status(200).json({ success: true, message: 'Ticket assigned', data: ticket });
  } catch (error) {
    next(error);
  }
};

// ─── AGENT CRUD OPERATIONS ──────────────────────────────────────────────────

// ✅ Create agent
export const createAgent = async (req, res, next) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;

    if (!['laboAgent', 'radioAgent', 'consultation agent'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid agent role' });
    }

    const agent = await User.create({ fullName, email, phoneNumber, password, role });
    res.status(201).json({ success: true, message: 'Agent created', data: agent });
  } catch (error) {
    next(error);
  }
};

// ✅ Get all agents
export const getAllAgents = async (req, res, next) => {
  try {
    const agents = await User.find({
      role: { $in: ['laboAgent', 'radioAgent', 'consultation agent'] }
    });
    res.status(200).json({ success: true, data: agents });
  } catch (error) {
    next(error);
  }
};

// ✅ Get agent by ID
export const getAgentById = async (req, res, next) => {
  try {
    const agent = await User.findById(req.params.id);
    if (!agent || !['laboAgent', 'radioAgent', 'consultation agent'].includes(agent.role)) {
      return res.status(404).json({ success: false, message: 'Agent not found' });
    }
    res.status(200).json({ success: true, data: agent });
  } catch (error) {
    next(error);
  }
};

// ✅ Update agent
export const updateAgent = async (req, res, next) => {
  try {
    const { fullName, email, phoneNumber, role } = req.body;

    const agent = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, email, phoneNumber, role },
      { new: true }
    );

    if (!agent) {
      return res.status(404).json({ success: false, message: 'Agent not found' });
    }

    res.status(200).json({ success: true, message: 'Agent updated', data: agent });
  } catch (error) {
    next(error);
  }
};

// ✅ Delete agent
export const deleteAgent = async (req, res, next) => {
  try {
    const agent = await User.findByIdAndDelete(req.params.id);
    if (!agent) {
      return res.status(404).json({ success: false, message: 'Agent not found' });
    }

    res.status(200).json({ success: true, message: 'Agent deleted' });
  } catch (error) {
    next(error);
  }
};
