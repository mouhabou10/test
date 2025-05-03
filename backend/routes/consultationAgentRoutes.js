import { Router } from 'express';
import {
  createConsultationAgent,
  getAllConsultationAgents,
  getConsultationAgentById,
  updateConsultationAgent,
  deleteConsultationAgent
} from '../controllers/ConsultationAgentController.js';

const consultationAgentRouter = Router();

consultationAgentRouter.post('/', createConsultationAgent);
consultationAgentRouter.get('/', getAllConsultationAgents);
consultationAgentRouter.get('/:id', getConsultationAgentById);
consultationAgentRouter.put('/:id', updateConsultationAgent);
consultationAgentRouter.delete('/:id', deleteConsultationAgent);

export default consultationAgentRouter;
