import Ticket from '../models/ticket.model.js';
import User from '../models/user.model.js';

// ──────────────── CONSULTATION TICKET LOGIC ────────────────

// Assign the next consultation ticket
export const assignNextConsultation = async (req, res, next) => {
  try {
    const ticket = await Ticket.findOneAndUpdate(
      { status: 'pending', type: 'consultation' },
      { status: 'in_progress' },
      { new: true, sort: { createdAt: 1 } }
    );

    if (!ticket) {
      return res.status(404).json({ message: 'No pending consultation tickets' });
    }

    res.json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

// Pause the consultation ticket system
export const pauseConsultationDemand = async (req, res, next) => {
  try {
    global.consultationPaused = true;
    res.json({ success: true, message: 'Consultation demand paused' });
  } catch (error) {
    next(error);
  }
};

// Reset consultation tickets
export const resetConsultationTickets = async (req, res, next) => {
  try {
    await Ticket.deleteMany({ type: 'consultation' });
    res.json({ success: true, message: 'Consultation tickets reset for the day' });
  } catch (error) {
    next(error);
  }
};

// ──────────────── CONSULTATION AGENT CRUD ────────────────

export const createAgent = async (req, res, next) => {
  try {
    const { userId, fullName, email, phoneNumber, password } = req.body;

    const agent = await User.create({
      userId,
      fullName,
      email,
      phoneNumber,
      password,
      role: 'consultation agent'
    });

    res.status(201).json({ success: true, message: 'Consultation agent created', data: agent });
  } catch (error) {
    next(error);
  }
};

export const getAllAgents = async (req, res, next) => {
  try {
    const agents = await User.find({ role: 'consultation agent' });
    res.json({ success: true, data: agents });
  } catch (error) {
    next(error);
  }
};

export const getAgentById = async (req, res, next) => {
  try {
    const agent = await User.findOne({ _id: req.params.id, role: 'consultation agent' });

    if (!agent) return res.status(404).json({ success: false, message: 'Consultation agent not found' });

    res.json({ success: true, data: agent });
  } catch (error) {
    next(error);
  }
};

export const updateAgent = async (req, res, next) => {
  try {
    const updated = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'consultation agent' },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: 'Consultation agent not found' });

    res.json({ success: true, message: 'Consultation agent updated', data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteAgent = async (req, res, next) => {
  try {
    const deleted = await User.findOneAndDelete({ _id: req.params.id, role: 'consultation agent' });

    if (!deleted) return res.status(404).json({ success: false, message: 'Consultation agent not found' });

    res.json({ success: true, message: 'Consultation agent deleted' });
  } catch (error) {
    next(error);
  }
};
