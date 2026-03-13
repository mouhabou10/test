import express from 'express';
import {
  createClient,
  deleteClient,
  uploadDocument,
  downloadDocument,
  getMyTickets,
  getClientStats
} from '../controllers/clientController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/documents/' });

router.post('/', createClient);
router.delete('/:id', deleteClient);
router.post('/documents', upload.single('file'), uploadDocument);
router.get('/documents/:documentId', downloadDocument);
router.get('/tickets', getMyTickets);
router.get('/:id/stats', getClientStats);

export default router;

