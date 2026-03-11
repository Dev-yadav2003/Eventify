import { query } from "../config/db.js";

const mapNotification = (row) => {
  if (!row) {
    return null;
  }

  return {
    _id: row.id,
    user: row.user_id,
    title: row.title,
    body: row.body,
    read: row.read,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

export const createNotification = async ({ userId, title, body }, client = null) => {
  const { rows } = await query(
    `
      INSERT INTO notifications (user_id, title, body, read, created_at, updated_at)
      VALUES ($1, $2, $3, FALSE, NOW(), NOW())
      RETURNING *
    `,
    [userId, title, body],
    client
  );

  return mapNotification(rows[0]);
};

export const createNotifications = async (notifications) => {
  const created = [];

  for (const notification of notifications) {
    created.push(await createNotification(notification));
  }

  return created;
};

export const getNotificationsByUser = async (userId) => {
  const { rows } = await query(
    "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20",
    [userId]
  );

  return rows.map(mapNotification);
};

export const markNotificationRead = async (id, userId) => {
  const { rows } = await query(
    `
      UPDATE notifications
      SET read = TRUE, updated_at = NOW()
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `,
    [id, userId]
  );

  return mapNotification(rows[0]);
};
