// controllers/notificationController.js
import Notification from '../models/Notification.js';

export const createNotification = async (req, res, next) => {
  try {
    const { senderId, receiverId, content } = req.body;

    const notification = await Notification.create({
      sender: senderId,
      receiver: receiverId,
      content,
      read: false,
      createdAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserNotifications = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.find({ receiver: userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};
