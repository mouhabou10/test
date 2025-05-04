import { Router } from 'express';
import {
  createNotification,
  deleteNotification
} from '../controllers/NotificationController.js';

const notificationRouter = Router();

notificationRouter.post('/', createNotification);

notificationRouter.delete('/:id', deleteNotification);

export default notificationRouter;
