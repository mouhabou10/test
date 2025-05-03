import { Router } from 'express';
import {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument
} from '../controllers/DocumentController.js';

const documentRouter = Router();

documentRouter.post('/', createDocument);
documentRouter.get('/', getAllDocuments);
documentRouter.get('/:id', getDocumentById);
documentRouter.put('/:id', updateDocument);
documentRouter.delete('/:id', deleteDocument);

export default documentRouter;
