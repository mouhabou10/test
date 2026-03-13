// routes/documentRoutes.js
import { Router } from 'express';
import {
  createDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocument,
  getClientDocuments
} from '../controllers/documentController.js';

import upload from '../middlewares/upload.js'; // 👈 Import multer middleware
import { isAuthenticated } from '../middlewares/auth.js'; // Import authentication middleware

const documentRouter = Router();

// 👇 Use upload.single('file') to accept one file
documentRouter.post('/', upload.single('file'), createDocument);



// Get all documents
documentRouter.get('/', getAllDocuments);

// Get documents for a specific client
documentRouter.get('/client/:clientId', getClientDocuments);

// Get, update, delete document by ID
documentRouter.get('/:id', getDocumentById);
documentRouter.delete('/:id', deleteDocument);

export default documentRouter;
