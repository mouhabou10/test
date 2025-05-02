import Document from '../models/Document.js';
import Ticket from '../models/Ticket.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
