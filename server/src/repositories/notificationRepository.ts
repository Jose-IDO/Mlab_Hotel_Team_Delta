import db from "../config/db";

export type NotificationType = 'booking_confirmation' | 'booking_update' | 'promotion' | 'general';

export const notificationRepository = {
  async create(userId: string, message: string, bookingId?: string, type: NotificationType = 'general') {
    const query = `
      INSERT INTO notifications (user_id, message, booking_id, type) 
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [userId, message, bookingId || null, type];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async createBulk(userIds: string[], message: string, type: NotificationType = 'promotion') {
    const query = `
      INSERT INTO notifications (user_id, message, type)
      SELECT unnest($1::uuid[]), $2, $3
      RETURNING *;
    `;
    const result = await db.query(query, [userIds, message, type]);
    return result.rows;
  },

  async getUserNotifications(userId: string) {
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

  async deleteByBookingId(bookingId: string) {
    const query = `
      DELETE FROM notifications 
      WHERE booking_id = $1 
      RETURNING *;
    `;
    const result = await db.query(query, [bookingId]);
    return result.rows;
  },
};
