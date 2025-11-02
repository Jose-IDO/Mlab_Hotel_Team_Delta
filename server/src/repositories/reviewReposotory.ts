import db from '../config/db';
import { Review } from '../types/room.types';

export const reviewRepository = {
  async findByRoomId(roomId: string): Promise<Review[]> {
    // Tell TypeScript the shape of each row returned
    type ReviewRow = {
      id: string;
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
      id: row.id,
      roomId: row.room_id,
      author: row.author || 'Anonymous',
      comment: row.comment,
      rating: row.rating,
      timestamp: row.timestamp,
    }));
  },
};
