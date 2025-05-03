import { Router } from 'express';
import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient
} from '../controllers/ClientController.js';

const clientRouter = Router();

clientRouter.post('/', createClient);
clientRouter.get('/', getAllClients);
clientRouter.get('/:id', getClientById);
clientRouter.put('/:id', updateClient);
clientRouter.delete('/:id', deleteClient);

export default clientRouter;
