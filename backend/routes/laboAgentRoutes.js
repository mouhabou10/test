import { Router } from 'express';
import {
  createAgentLab,
  getAllAgentLab,
  getAgentLabById,
  updateAgentLab,
  deleteAgentLab
} from '../controllers/AgentLabController.js';

const agentLabRouter = Router();

agentLabRouter.post('/', createAgentLab);
agentLabRouter.get('/', getAllAgentLab);
agentLabRouter.get('/:id', getAgentLabById);
agentLabRouter.put('/:id', updateAgentLab);
agentLabRouter.delete('/:id', deleteAgentLab);

export default agentLabRouter;
