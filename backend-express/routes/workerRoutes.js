import { Router } from 'express';
import {
  createWorker,
  getAllWorkers,
  getWorkerById,
  deleteWorker,
  updateWorker
} from '../controllers/workerController.js';


const workerRouter = Router();

workerRouter.post('/', createWorker);
workerRouter.get('/', getAllWorkers);
workerRouter.get('/:id', getWorkerById);
workerRouter.put('/:id', updateWorker);
workerRouter.delete('/:id', deleteWorker);

export default workerRouter;
