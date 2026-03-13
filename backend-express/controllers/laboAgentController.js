import Ticket from '../models/ticket.model.js';
import Prescription from '../models/prescription.model.js';
import Result from '../models/result.model.js';
import User from '../models/user.model.js';

// ──────────────── TICKET / PRESCRIPTION / RESULT LOGIC ────────────────

// Assign next labo ticket
export const assignNextLabTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findOneAndUpdate(
      { status: 'pending', type: 'labo' },
      { status: 'in_progress' },
      { new: true, sort: { createdAt: 1 } }
    );

    if (!ticket) return res.status(404).json({ message: 'No pending lab tickets' });

    res.json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

// Pause lab ticket demand
export const pauseLabDemand = async (req, res, next) => {
  try {
    global.labDemandPaused = true;
    res.json({ success: true, message: 'Lab demand paused' });
  } catch (error) {
    next(error);
  }
};

// Reset lab tickets
export const resetLabTickets = async (req, res, next) => {
  try {
    await Ticket.deleteMany({ type: 'labo' });
    res.json({ success: true, message: 'Lab tickets reset for the day' });
  } catch (error) {
    next(error);
  }
};

// Update lab prescription status
export const updateLabPrescription = async (req, res, next) => {
  try {
    const { prescriptionId } = req.params;
    const { status } = req.body;

    const updated = await Prescription.findOneAndUpdate(
      { _id: prescriptionId, type: 'labo' },
      { status },
      { new: true }
    );

    res.json({ success: true, message: 'Lab prescription updated', data: updated });
  } catch (error) {
    next(error);
  }
};

// Upload lab result
export const uploadLabResult = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { fileUrl, documentId } = req.body;

    const result = await Result.create({ document: documentId, fileUrl });

    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: ticketId, type: 'labo' },
      { status: 'completed' },
      { new: true }
    );

    res.json({ success: true, message: 'Lab result uploaded', data: { result, ticket: updatedTicket } });
  } catch (error) {
    next(error);
  }
};

// ──────────────── LAB AGENT CRUD ────────────────

// Create labo agent
export const createAgent = async (req, res, next) => {
  try {
    const { userId, fullName, email, phoneNumber, password } = req.body;

    const agent = await User.create({
      userId,
      fullName,
      email,
      phoneNumber,
      password,
      role: 'laboAgent'
    });

    res.status(201).json({ success: true, message: 'Labo agent created', data: agent });
  } catch (error) {
    next(error);
  }
};

// Get all labo agents
export const getAllAgents = async (req, res, next) => {
  try {
    const agents = await User.find({ role: 'laboAgent' });
    res.json({ success: true, data: agents });
  } catch (error) {
    next(error);
  }
};

// Get labo agent by ID
export const getAgentById = async (req, res, next) => {
  try {
    const agent = await User.findOne({ _id: req.params.id, role: 'laboAgent' });

    if (!agent) return res.status(404).json({ success: false, message: 'Labo agent not found' });

    res.json({ success: true, data: agent });
  } catch (error) {
    next(error);
  }
};

// Update labo agent
export const updateAgent = async (req, res, next) => {
  try {
    const updated = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'laboAgent' },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: 'Labo agent not found' });

    res.json({ success: true, message: 'Labo agent updated', data: updated });
  } catch (error) {
    next(error);
  }
};

// Delete labo agent
export const deleteAgent = async (req, res, next) => {
  try {
    const deleted = await User.findOneAndDelete({ _id: req.params.id, role: 'laboAgent' });

    if (!deleted) return res.status(404).json({ success: false, message: 'Labo agent not found' });

    res.json({ success: true, message: 'Labo agent deleted' });
  } catch (error) {
    next(error);
  }
};
