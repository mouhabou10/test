import Document from '../models/Document.js';

// ─── CREATE DOCUMENT ──────────────────────────────────────────────────────
export const createDocument = async (req, res, next) => {
  try {
    const { id, name, path, ownerId, date } = req.body;
    const newDocument = await Document.create({ id, name, path, ownerId, date });
    res.status(201).json({ success: true, message: 'Document created', data: newDocument });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL DOCUMENTS ────────────────────────────────────────────────────
export const getAllDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find();
    res.status(200).json({ success: true, data: documents });
  } catch (error) {
    next(error);
  }
};

// ─── GET DOCUMENT BY ID ───────────────────────────────────────────────────
export const getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
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
