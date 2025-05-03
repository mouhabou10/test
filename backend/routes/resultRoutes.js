import { Router } from 'express';
import {
  createResult,
  getAllResults,
  getResultById,
  updateResult,
  deleteResult
} from '../controllers/ResultController.js';

const resultRouter = Router();

resultRouter.post('/', createResult);
resultRouter.get('/', getAllResults);
resultRouter.get('/:id', getResultById);
resultRouter.put('/:id', updateResult);
resultRouter.delete('/:id', deleteResult);

export default resultRouter;
