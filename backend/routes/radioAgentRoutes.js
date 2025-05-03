import { Router } from 'express';
import {
  createAgentRadio,
  getAllAgentRadio,
  getAgentRadioById,
  updateAgentRadio,
  deleteAgentRadio
} from '../controllers/AgentRadioController.js';

const agentRadioRouter = Router();

agentRadioRouter.post('/', createAgentRadio);
agentRadioRouter.get('/', getAllAgentRadio);
agentRadioRouter.get('/:id', getAgentRadioById);
agentRadioRouter.put('/:id', updateAgentRadio);
agentRadioRouter.delete('/:id', deleteAgentRadio);

export default agentRadioRouter;
