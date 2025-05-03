import { Router } from 'express';
import {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification
} from '../controllers/NotificationController.js';

const notificationRouter = Router();

notificationRouter.post('/', createNotification);
notificationRouter.get('/', getAllNotifications);
notificationRouter.get('/:id', getNotificationById);
notificationRouter.put('/:id', updateNotification);
notificationRouter.delete('/:id', deleteNotification);

export default notificationRouter;
