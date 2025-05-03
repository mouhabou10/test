import { Router } from 'express';
import {
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent
} from '../controllers/AgentController.js';

const agentRouter = Router();

agentRouter.post('/', createAgent);
agentRouter.get('/', getAllAgents);
agentRouter.get('/:id', getAgentById);
agentRouter.put('/:id', updateAgent);
agentRouter.delete('/:id', deleteAgent);

export default agentRouter;
