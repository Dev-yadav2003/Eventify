import { getNotificationsByUser, markNotificationRead as markNotificationReadRecord } from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  const notifications = await getNotificationsByUser(req.user._id);
  res.json(notifications);
};

export const markNotificationRead = async (req, res) => {
  const notification = await markNotificationReadRecord(req.params.id, req.user._id);
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found.");
  }

  res.json(notification);
};
