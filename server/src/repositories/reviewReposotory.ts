// reviewRepository.ts
import db from '../config/db';
import { Review } from '../types/room.types';

export const reviewRepository = {
  async findByRoomId(roomId: string): Promise<Review[]> {
    type ReviewRow = {
      id: number;
      room_id: string;
      author: string | null;
      comment: string;
      rating: number;
      timestamp: string;
    };

    const result = await db.query<ReviewRow>(
      'SELECT id, room_id, author, comment, rating, timestamp FROM reviews WHERE room_id = $1 ORDER BY timestamp DESC',
      [roomId]
    );

    return result.rows.map((row: ReviewRow) => ({
      id: row.id.toString(), // convert id to string for frontend consistency
      roomId: row.room_id,
      author: row.author || 'Anonymous',
      comment: row.comment,
      rating: row.rating,
      timestamp: row.timestamp,
    }));
  },

  async create(review: {
    roomId: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }): Promise<Review> {
    const result = await db.query(
      `INSERT INTO reviews (room_id, author, comment, rating, timestamp)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, room_id, author, comment, rating, timestamp`,
      [review.roomId, review.name, review.comment, review.rating, review.createdAt]
    );

    const row = result.rows[0];
    return {
      id: row.id.toString(), // convert to string for frontend
      roomId: row.room_id,
      author: row.author,
      comment: row.comment,
      rating: row.rating,
      timestamp: row.timestamp,
    };
  },
};
