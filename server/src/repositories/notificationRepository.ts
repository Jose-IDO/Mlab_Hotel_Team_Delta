import db from "../config/db";

export const notificationRepository = {
  async create(userId: number, message: string, bookingId?: number) {
    const query = `
      INSERT INTO notifications (user_id, message, booking_id) 
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const values = [userId, message, bookingId || null];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async getUserNotifications(userId: number) {
    const query = `
      SELECT * FROM notifications 
      WHERE user_id = $1 
      ORDER BY created_at DESC;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  },

  async markAsRead(id: number) {
    const query = `
      UPDATE notifications 
      SET read = TRUE 
      WHERE id = $1 
      RETURNING *;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  },
};
