// controllers/notificationController.js
import Notification from '../models/notification.js';

// ─── CREATE NOTIFICATION ────────────────────────────────────────────────────
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

// ─── GET USER NOTIFICATIONS ─────────────────────────────────────────────────
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

// ─── MARK NOTIFICATION AS READ ──────────────────────────────────────────────
export const markAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE A NOTIFICATION ──────────────────────────────────────────────────
export const deleteNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    const deleted = await Notification.findByIdAndDelete(notificationId);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error) {
    next(error);
  }
};

// ─── CLEAR ALL USER NOTIFICATIONS ───────────────────────────────────────────
export const clearAllNotifications = async (req, res, next) => {
  try {
    const { userId } = req.params;

    await Notification.deleteMany({ receiver: userId });

    res.json({
      success: true,
      message: 'All notifications cleared',
    });
  } catch (error) {
    next(error);
  }
};
