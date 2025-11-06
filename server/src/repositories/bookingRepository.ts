import pool from '../config/db';
import { Booking } from '../types/booking.types';

function rowToBooking(r: any): Booking {
  return {
    id: r.id,
    userId: r.user_id,
    roomId: r.room_id,
    checkIn: r.check_in,
    checkOut: r.check_out,
    guests: r.guests,
    totalPrice: Number(r.total_price),
    status: r.status,
    paymentReference: r.payment_reference,
    expiresAt: r.expires_at,
    roomCount: r.room_count ?? 1,
    createdAt: r.created_at,
  };
}

export class BookingRepository {
  async countRoomUnits(roomId: string): Promise<number> {
    const { rows } = await pool.query(
      'SELECT COUNT(*)::int AS cnt FROM room_units WHERE room_id = $1 AND status = $2',
      [roomId, 'active']
    );
    return rows[0]?.cnt ?? 0;
  }

  async countOverlappingBookings(roomId: string, checkIn: string, checkOut: string): Promise<number> {
    // Overlap if (a.start < b.end) AND (b.start < a.end) with checkout exclusive
    const { rows } = await pool.query(
      `SELECT COUNT(*)::int AS cnt
       FROM bookings
       WHERE room_id = $1
         AND status IN ('pending','confirmed')
         AND check_in < $3
         AND $2 < check_out`,
      [roomId, checkIn, checkOut]
    );
    return rows[0]?.cnt ?? 0;
  }

  async create(userId: string, roomId: string, checkIn: string, checkOut: string, guests: number, totalPrice: number, roomCount: number = 1): Promise<Booking> {
    const { rows } = await pool.query(
      `INSERT INTO bookings (user_id, room_id, check_in, check_out, guests, total_price, status, room_count)
       VALUES ($1, $2, $3, $4, $5, $6, 'confirmed', $7)
       RETURNING *`,
      [userId, roomId, checkIn, checkOut, guests, totalPrice, roomCount]
    );
    return rowToBooking(rows[0]);
  }

  async createPending(
    userId: string,
    roomId: string,
    checkIn: string,
    checkOut: string,
    guests: number,
    totalPrice: number,
    paymentRef: string | null,
    expiresAt: string,
    roomCount: number = 1
  ): Promise<Booking> {
    const { rows } = await pool.query(
      `INSERT INTO bookings (user_id, room_id, check_in, check_out, guests, total_price, status, payment_reference, expires_at, room_count)
       VALUES ($1,$2,$3,$4,$5,$6,'pending',$7,$8,$9)
       RETURNING *`,
      [userId, roomId, checkIn, checkOut, guests, totalPrice, paymentRef, expiresAt, roomCount]
    );
    return rowToBooking(rows[0]);
  }

  async findByUser(userId: string): Promise<Booking[]> {
    const { rows } = await pool.query(
      'SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return rows.map(rowToBooking);
  }

  async findById(id: string): Promise<Booking | null> {
    const { rows } = await pool.query(
      'SELECT * FROM bookings WHERE id = $1',
      [id]
    );
    return rows[0] ? rowToBooking(rows[0]) : null;
  }

  async findByPaymentReference(paymentRef: string): Promise<Booking | null> {
    const { rows } = await pool.query(
      'SELECT * FROM bookings WHERE payment_reference = $1',
      [paymentRef]
    );
    return rows[0] ? rowToBooking(rows[0]) : null;
  }

  async findAll(): Promise<any[]> {
    const { rows } = await pool.query(
      `SELECT 
        b.*,
        u.first_name || ' ' || u.last_name AS guest_name,
        u.email AS guest_email,
        r.room_name,
        r.room_type
       FROM bookings b
       LEFT JOIN users u ON b.user_id = u.id
       LEFT JOIN rooms r ON b.room_id = r.id
       ORDER BY b.created_at DESC`
    );
    return rows.map(r => ({
      ...rowToBooking(r),
      guestName: r.guest_name,
      guestEmail: r.guest_email,
      roomName: r.room_name,
      roomType: r.room_type,
    }));
  }

  async updateStatus(id: string, status: 'pending'|'confirmed'|'cancelled'): Promise<Booking | null> {
    const { rows } = await pool.query(
      'UPDATE bookings SET status = $2 WHERE id = $1 RETURNING *',
      [id, status]
    );
    return rows[0] ? rowToBooking(rows[0]) : null;
  }

  async updatePaymentReference(id: string, paymentRef: string): Promise<Booking | null> {
    const { rows } = await pool.query(
      'UPDATE bookings SET payment_reference = $2 WHERE id = $1 RETURNING *',
      [id, paymentRef]
    );
    return rows[0] ? rowToBooking(rows[0]) : null;
  }

  async confirmByPaymentRef(paymentRef: string): Promise<Booking | null> {
    const { rows } = await pool.query(
      `UPDATE bookings
       SET status = 'confirmed'
       WHERE payment_reference = $1
       RETURNING *`,
      [paymentRef]
    );
    return rows[0] ? rowToBooking(rows[0]) : null;
  }

  async cancelExpiredPendings(nowIso: string): Promise<number> {
    const { rowCount } = await pool.query(
      `UPDATE bookings
       SET status = 'cancelled'
       WHERE status = 'pending' AND expires_at IS NOT NULL AND expires_at <= $1`,
      [nowIso]
    );
    return rowCount ?? 0;
  }

  async findInRange(startDate: string, endDate: string): Promise<Array<{ roomId: string; checkIn: string; checkOut: string; status: string; roomCount: number }>> {
    // Return bookings overlapping the given range. Checkout is exclusive.
    const { rows } = await pool.query(
      `SELECT room_id, check_in, check_out, status, COALESCE(room_count,1) AS room_count
       FROM bookings
       WHERE status IN ('pending','confirmed')
         AND check_in < $2
         AND $1 < check_out`,
      [startDate, endDate]
    );
    return rows.map(r => ({
      roomId: r.room_id,
      checkIn: r.check_in,
      checkOut: r.check_out,
      status: r.status,
      roomCount: Number(r.room_count) || 1,
    }));
  }
}

export const bookingRepository = new BookingRepository();