import { Router } from 'express';
import {
  createDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocument
} from '../controllers/documentController.js';

import upload from '../Middlewares/upload.js';

const documentRouter = Router();

// Accept file upload with "file" key
documentRouter.post('/', upload.single('file'), createDocument);
documentRouter.get('/', getAllDocuments);
documentRouter.get('/:id', getDocumentById);
documentRouter.delete('/:id', deleteDocument);

export default documentRouter;
