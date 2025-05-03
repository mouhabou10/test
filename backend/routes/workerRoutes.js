import { Router } from 'express';
import {
  createWorker,
  getAllWorkers,
  getWorkerById,
  updateWorker,
  deleteWorker
} from '../controllers/WorkerController.js';

const workerRouter = Router();

workerRouter.post('/', createWorker);
workerRouter.get('/', getAllWorkers);
workerRouter.get('/:id', getWorkerById);
workerRouter.put('/:id', updateWorker);
workerRouter.delete('/:id', deleteWorker);

export default workerRouter;
