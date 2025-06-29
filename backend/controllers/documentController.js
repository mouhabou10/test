import Document from '../models/document.model.js';
import User from '../models/user.model.js';

// ─── CREATE DOCUMENT ──────────────────────────────────────────────────────
export const createDocument = async (req, res, next) => {
  try {
    const { title, type, client, createdBy } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const newDocument = await Document.create({
      title,
      type,
      client,
      createdBy,
      path: file.path // Ensure this path is relative to your static folder
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: newDocument
    });
  } catch (error) {
    next(error);
  }
};
// GET all documents
export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .populate('client', 'name')       // populate client with name only
      .populate('createdBy', 'name');   // populate creator with name only

    res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// ─── GET ALL DOCUMENTS ────────────────────────────────────────────────────
export const getAllDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find()
      .populate('client', 'name')
      .populate('createdBy', 'name');
    res.status(200).json({ success: true, data: documents });
  } catch (error) {
    next(error);
  }
};

// ─── GET DOCUMENT BY ID ───────────────────────────────────────────────────
export const getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('client', 'name')
      .populate('createdBy', 'name');
    if (!document) throw new Error('Document not found');
    res.status(200).json({ success: true, data: document });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE DOCUMENT ──────────────────────────────────────────────────────
export const deleteDocument = async (req, res, next) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Document deleted' });
  } catch (error) {
    next(error);
  }
};
// ─── GET DOCUMENTS BY SERVICE PROVIDER ID AND DOCUMENT TYPE ───────────────
export const getDocumentsByServiceProviderAndType = async (req, res, next) => {
  try {
    // Example: /documents/filter?serviceProvider=abc123&type=Ordonnance
    const { serviceProvider, type } = req.query;

    if (!serviceProvider) {
      return res.status(400).json({ success: false, message: 'serviceProvider query parameter is required' });
    }
    if (!type) {
      return res.status(400).json({ success: false, message: 'type query parameter is required' });
    }

    const documents = await Document.find({
      serviceProvider: serviceProvider,
      type: type
    })
      .populate('client', 'name')
      .populate('createdBy', 'name');

    res.status(200).json({ success: true, data: documents });
  } catch (error) {
    next(error);
  }
};

// ─── GET CLIENT DOCUMENTS ────────────────────────────────────────────────────
export const getClientDocuments = async (req, res, next) => {
  try {
    const clientId = req.params.clientId;
    
    const documents = await Document.find({ client: clientId })
      .populate('createdBy', 'name');
    
    res.status(200).json({ success: true, data: documents });
  } catch (error) {
    next(error);
  }
};
