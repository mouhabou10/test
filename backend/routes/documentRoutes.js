// routes/documentRoutes.js
import { Router } from 'express';
import {
  createDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocument
} from '../controllers/documentController.js';

import upload from '../middlewares/upload.js'; // 👈 Import multer middleware

const documentRouter = Router();

// 👇 Use upload.single('file') to accept one file
documentRouter.post('/', upload.single('file'), createDocument);

documentRouter.get('/', getAllDocuments);
documentRouter.get('/:id', getDocumentById);
documentRouter.delete('/:id', deleteDocument);

export default documentRouter;
