import express from 'express';
import {
  assignNextRadioTicket,
  pauseRadioDemand,
  resetRadioTickets,
  uploadRadioResult,
  updateRadioPrescription,
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent
} from '../controllers/radioAgentController.js';

const router = express.Router();

// Radio ticket operations
router.post('/assign', assignNextRadioTicket);
router.post('/pause', pauseRadioDemand);
router.delete('/reset', resetRadioTickets);
router.post('/upload-result/:ticketId', uploadRadioResult);
router.put('/update-prescription/:prescriptionId', updateRadioPrescription);

// Agent data operations
router.post('/', createAgent);
router.get('/', getAllAgents);
router.get('/:id', getAgentById);
router.put('/:id', updateAgent);
router.delete('/:id', deleteAgent);

export default router;
