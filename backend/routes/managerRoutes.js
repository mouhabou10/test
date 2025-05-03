import { Router } from 'express';
import {
  createManager,
  getAllManagers,
  getManagerById,
  updateManager,
  deleteManager
} from '../controllers/ManagerController.js';

const managerRouter = Router();

managerRouter.post('/', createManager);
managerRouter.get('/', getAllManagers);
managerRouter.get('/:id', getManagerById);
managerRouter.put('/:id', updateManager);
managerRouter.delete('/:id', deleteManager);

export default managerRouter;
