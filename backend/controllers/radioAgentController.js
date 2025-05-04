import Ticket from '../models/ticket.model.js';
import Prescription from '../models/prescription.model.js';
import Result from '../models/result.model.js';
import User from '../models/user.model.js';

// ──────────────── TICKET / PRESCRIPTION / RESULT LOGIC ────────────────

// Assign next radio ticket
export const assignNextRadioTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findOneAndUpdate(
      { status: 'pending', type: 'radio' },
      { status: 'in_progress' },
      { new: true, sort: { createdAt: 1 } }
    );

    if (!ticket) return res.status(404).json({ message: 'No pending radio tickets' });

    res.json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

// Pause radio ticket demand
export const pauseRadioDemand = async (req, res, next) => {
  try {
    global.radioDemandPaused = true;
    res.json({ success: true, message: 'Radio demand paused' });
  } catch (error) {
    next(error);
  }
};

// Reset radio tickets
export const resetRadioTickets = async (req, res, next) => {
  try {
    await Ticket.deleteMany({ type: 'radio' });
    res.json({ success: true, message: 'Radio tickets reset for the day' });
  } catch (error) {
    next(error);
  }
};

// Update radio prescription status
export const updateRadioPrescription = async (req, res, next) => {
  try {
    const { prescriptionId } = req.params;
    const { status } = req.body;

    const updated = await Prescription.findOneAndUpdate(
      { _id: prescriptionId, type: 'radio' },
      { status },
      { new: true }
    );

    res.json({ success: true, message: 'Radio prescription updated', data: updated });
  } catch (error) {
    next(error);
  }
};

// Upload radio result
export const uploadRadioResult = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { fileUrl, documentId } = req.body;

    const result = await Result.create({ document: documentId, fileUrl });

    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: ticketId, type: 'radio' },
      { status: 'completed' },
      { new: true }
    );

    res.json({ success: true, message: 'Radio result uploaded', data: { result, ticket: updatedTicket } });
  } catch (error) {
    next(error);
  }
};

// ──────────────── RADIO AGENT CRUD ────────────────

export const createAgent = async (req, res, next) => {
  try {
    const { userId, fullName, email, phoneNumber, password } = req.body;

    const agent = await User.create({
      userId,
      fullName,
      email,
      phoneNumber,
      password,
      role: 'radioAgent'
    });

    res.status(201).json({ success: true, message: 'Radio agent created', data: agent });
  } catch (error) {
    next(error);
  }
};

export const getAllAgents = async (req, res, next) => {
  try {
    const agents = await User.find({ role: 'radioAgent' });
    res.json({ success: true, data: agents });
  } catch (error) {
    next(error);
  }
};

export const getAgentById = async (req, res, next) => {
  try {
    const agent = await User.findOne({ _id: req.params.id, role: 'radioAgent' });

    if (!agent) return res.status(404).json({ success: false, message: 'Radio agent not found' });

    res.json({ success: true, data: agent });
  } catch (error) {
    next(error);
  }
};

export const updateAgent = async (req, res, next) => {
  try {
    const updated = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'radioAgent' },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: 'Radio agent not found' });

    res.json({ success: true, message: 'Radio agent updated', data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteAgent = async (req, res, next) => {
  try {
    const deleted = await User.findOneAndDelete({ _id: req.params.id, role: 'radioAgent' });

    if (!deleted) return res.status(404).json({ success: false, message: 'Radio agent not found' });

    res.json({ success: true, message: 'Radio agent deleted' });
  } catch (error) {
    next(error);
  }
};
