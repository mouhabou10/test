import express from 'express';
import {
  assignNextLabTicket,
  pauseLabDemand,
  resetLabTickets,
  uploadLabResult,
  updateLabPrescription,
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent
} from '../controllers/laboAgentController.js';

const router = express.Router();

// Lab ticket operations
router.post('/assign', assignNextLabTicket);
router.post('/pause', pauseLabDemand);
router.delete('/reset', resetLabTickets);
router.post('/upload-result/:ticketId', uploadLabResult);
router.put('/update-prescription/:prescriptionId', updateLabPrescription);

// Agent data operations
router.post('/', createAgent);
router.get('/', getAllAgents);
router.get('/:id', getAgentById);
router.put('/:id', updateAgent);
router.delete('/:id', deleteAgent);

export default router;
