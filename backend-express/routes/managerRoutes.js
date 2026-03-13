// routes/managerRoutes.js
import express from 'express';
import {
  createManager,
  getAllManagers,
  getManagerById,
  deleteManager,
  createWorker,
  updateWorker,
  deleteWorker,
  createService,
  updateService,
  deleteService
} from '../controllers/managerController.js';

const router = express.Router();

// Manager CRUD
router.post('/', createManager);
router.get('/', getAllManagers);
router.get('/:id', getManagerById);
router.delete('/:id', deleteManager);

// Worker management by manager
router.post('/worker', createWorker);
router.put('/worker/:id', updateWorker);
router.delete('/worker/:id', deleteWorker);

// Service management by manager
router.post('/service', createService);
router.put('/service/:id', updateService);
router.delete('/service/:id', deleteService);

export default router;

