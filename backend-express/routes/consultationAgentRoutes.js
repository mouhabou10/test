import express from 'express';
import {
  assignNextConsultation,
  pauseConsultationDemand,
  resetConsultationTickets,
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent
} from '../controllers/consultationAgentController.js';

const router = express.Router();

// Consultation ticket operations
router.post('/assign', assignNextConsultation);
router.post('/pause', pauseConsultationDemand);
router.delete('/reset', resetConsultationTickets);

// Agent data operations
router.post('/', createAgent);
router.get('/', getAllAgents);
router.get('/:id', getAgentById);
router.put('/:id', updateAgent);
router.delete('/:id', deleteAgent);

export default router;
