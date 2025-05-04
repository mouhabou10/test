import Document from '../models/document.model.js';
import Ticket from '../models/ticket.model.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import User from '../models/user.model.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ─── CREATE CLIENT ───────────────────────────────────────────────────────
export const createClient = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user || user.role !== 'client') {
      return res.status(400).json({ success: false, message: 'Invalid or missing client user' });
    }

    res.status(201).json({ success: true, message: 'Client created successfully', data: user });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE CLIENT ───────────────────────────────────────────────────────
export const deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user || user.role !== 'client') {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Client deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Upload a document
export const uploadDocument = async (req, res, next) => {
  try {
    const { documentType } = req.body;
    const file = req.file;

    if (!file) {
      const error = new Error('No file uploaded');
      error.statusCode = 400;
      throw error;
    }

    const newDoc = await Document.create({
      patientId: req.user.id,
      documentType,
      filePath: file.path,
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: newDoc,
    });
  } catch (error) {
    next(error);
  }
};

// Download a document
export const downloadDocument = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const document = await Document.findById(documentId);

    if (!document) {
      const error = new Error('Document not found');
      error.statusCode = 404;
      throw error;
    }

    const filePath = path.join(__dirname, '..', document.filePath);
    res.download(filePath);
  } catch (error) {
    next(error);
  }
};

// Get all tickets by client
export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ client: req.user.id });

    res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};
