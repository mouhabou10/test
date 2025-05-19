import Document from '../models/document.model.js';

export const createDocument = async (req, res, next) => {
  try {
    const { title, type, client, createdBy } = req.body;
    const file = req.file;

    if (!title || !type || !client || !createdBy) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        data: { title, type, client, createdBy }
      });
    }

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const newDocument = await Document.create({
      title,
      type,
      client,
      createdBy,
      path: file.path
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
