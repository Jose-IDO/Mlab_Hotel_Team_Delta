import pool from '../config/db';
import { Payment, CreatePaymentDTO, UpdatePaymentDTO } from '../types/payment.types';

function rowToPayment(r: any): Payment {
  return {
    id: r.id,
    bookingId: r.booking_id,
    userId: r.user_id,
    amount: Number(r.amount),
    currency: r.currency,
    status: r.status,
    paymentMethod: r.payment_method,
    paymentReference: r.payment_reference,
    gatewayResponse: r.gateway_response,
    paymentDate: r.payment_date,
    failureReason: r.failure_reason,
    refundAmount: r.refund_amount ? Number(r.refund_amount) : undefined,
    refundDate: r.refund_date,
    refundReference: r.refund_reference,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export class PaymentRepository {
  async create(dto: CreatePaymentDTO): Promise<Payment> {
    const { rows } = await pool.query(
      `INSERT INTO payments (booking_id, user_id, amount, currency, payment_method, payment_reference, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING *`,
      [dto.bookingId, dto.userId, dto.amount, dto.currency || 'ZAR', dto.paymentMethod, dto.paymentReference]
    );
    return rowToPayment(rows[0]);
  }

  async findById(id: string): Promise<Payment | null> {
    const { rows } = await pool.query(
      'SELECT * FROM payments WHERE id = $1',
      [id]
    );
    return rows[0] ? rowToPayment(rows[0]) : null;
  }

  async findByReference(reference: string): Promise<Payment | null> {
    const { rows } = await pool.query(
      'SELECT * FROM payments WHERE payment_reference = $1',
      [reference]
    );
    return rows[0] ? rowToPayment(rows[0]) : null;
  }

  async findByBookingId(bookingId: string): Promise<Payment[]> {
    const { rows } = await pool.query(
      'SELECT * FROM payments WHERE booking_id = $1 ORDER BY created_at DESC',
      [bookingId]
    );
    return rows.map(rowToPayment);
  }

  async findByUserId(userId: string): Promise<Payment[]> {
    const { rows } = await pool.query(
      'SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return rows.map(rowToPayment);
  }

  async updateStatus(id: string, dto: UpdatePaymentDTO): Promise<Payment | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (dto.status) {
      updates.push(`status = $${paramIndex++}`);
      values.push(dto.status);
    }
    if (dto.paymentDate !== undefined) {
      updates.push(`payment_date = $${paramIndex++}`);
      values.push(dto.paymentDate);
    }
    if (dto.failureReason !== undefined) {
      updates.push(`failure_reason = $${paramIndex++}`);
      values.push(dto.failureReason);
    }
    if (dto.gatewayResponse !== undefined) {
      updates.push(`gateway_response = $${paramIndex++}`);
      values.push(JSON.stringify(dto.gatewayResponse));
    }

    if (updates.length === 0) return this.findById(id);

    values.push(id);
    const { rows } = await pool.query(
      `UPDATE payments SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    return rows[0] ? rowToPayment(rows[0]) : null;
  }

  async updateByReference(reference: string, dto: UpdatePaymentDTO): Promise<Payment | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (dto.status) {
      updates.push(`status = $${paramIndex++}`);
      values.push(dto.status);
    }
    if (dto.paymentDate !== undefined) {
      updates.push(`payment_date = $${paramIndex++}`);
      values.push(dto.paymentDate);
    }
    if (dto.failureReason !== undefined) {
      updates.push(`failure_reason = $${paramIndex++}`);
      values.push(dto.failureReason);
    }
    if (dto.gatewayResponse !== undefined) {
      updates.push(`gateway_response = $${paramIndex++}`);
      values.push(JSON.stringify(dto.gatewayResponse));
    }

    if (updates.length === 0) return this.findByReference(reference);

    values.push(reference);
    const { rows } = await pool.query(
      `UPDATE payments SET ${updates.join(', ')} WHERE payment_reference = $${paramIndex} RETURNING *`,
      values
    );
    return rows[0] ? rowToPayment(rows[0]) : null;
  }

  async findAll(): Promise<Payment[]> {
    const { rows } = await pool.query(
      'SELECT * FROM payments ORDER BY created_at DESC'
    );
    return rows.map(rowToPayment);
  }
}

export const paymentRepository = new PaymentRepository();
