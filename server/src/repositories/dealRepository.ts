import pool from '../config/db';
import { Deal, DealPayload, DealWithRoom } from '../types/deal.types';

export const dealRepository = {
  async createDeal(payload: DealPayload): Promise<Deal> {
    const query = `
      INSERT INTO deals (room_id, title, description, discount_percentage, start_date, end_date, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      payload.roomId,
      payload.title,
      payload.description || null,
      payload.discountPercentage,
      payload.startDate,
      payload.endDate,
      payload.isActive !== undefined ? payload.isActive : true
    ];
    const result = await pool.query(query, values);
    return rowToDeal(result.rows[0]);
  },

  async getAllDeals(): Promise<DealWithRoom[]> {
    const query = `
      SELECT 
        d.id, d.room_id, d.title, d.description, d.discount_percentage, 
        d.start_date, d.end_date, d.is_active, d.created_at,
        r.room_name, r.room_type, r.price, r.images, r.max_guests, r.bed_type
      FROM deals d
      JOIN rooms r ON d.room_id = r.id
      ORDER BY d.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows.map(rowToDealWithRoom);
  },

  async getActiveDeals(): Promise<DealWithRoom[]> {
    const query = `
      SELECT 
        d.id, d.room_id, d.title, d.description, d.discount_percentage, 
        d.start_date, d.end_date, d.is_active, d.created_at,
        r.room_name, r.room_type, r.price, r.images, r.max_guests, r.bed_type
      FROM deals d
      JOIN rooms r ON d.room_id = r.id
      WHERE d.is_active = true 
        AND d.start_date <= NOW() 
        AND d.end_date >= NOW()
        AND r.status = 'active'
      ORDER BY d.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows.map(rowToDealWithRoom);
  },

  async getDealById(id: number): Promise<DealWithRoom | null> {
    const query = `
      SELECT 
        d.id, d.room_id, d.title, d.description, d.discount_percentage, 
        d.start_date, d.end_date, d.is_active, d.created_at,
        r.room_name, r.room_type, r.price, r.images, r.max_guests, r.bed_type
      FROM deals d
      JOIN rooms r ON d.room_id = r.id
      WHERE d.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] ? rowToDealWithRoom(result.rows[0]) : null;
  },

  async updateDeal(id: number, payload: Partial<DealPayload>): Promise<Deal | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (payload.roomId !== undefined) {
      fields.push(`room_id = $${paramCount++}`);
      values.push(payload.roomId);
    }
    if (payload.title !== undefined) {
      fields.push(`title = $${paramCount++}`);
      values.push(payload.title);
    }
    if (payload.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(payload.description);
    }
    if (payload.discountPercentage !== undefined) {
      fields.push(`discount_percentage = $${paramCount++}`);
      values.push(payload.discountPercentage);
    }
    if (payload.startDate !== undefined) {
      fields.push(`start_date = $${paramCount++}`);
      values.push(payload.startDate);
    }
    if (payload.endDate !== undefined) {
      fields.push(`end_date = $${paramCount++}`);
      values.push(payload.endDate);
    }
    if (payload.isActive !== undefined) {
      fields.push(`is_active = $${paramCount++}`);
      values.push(payload.isActive);
    }

    if (fields.length === 0) {
      return null;
    }

    values.push(id);
    const query = `
      UPDATE deals 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] ? rowToDeal(result.rows[0]) : null;
  },

  async toggleDealActive(id: number): Promise<Deal | null> {
    const query = `
      UPDATE deals 
      SET is_active = NOT is_active
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] ? rowToDeal(result.rows[0]) : null;
  },

  async deleteDeal(id: number): Promise<boolean> {
    const query = 'DELETE FROM deals WHERE id = $1';
    const result = await pool.query(query, [id]);
    return (result.rowCount || 0) > 0;
  }
};

function rowToDeal(row: any): Deal {
  return {
    id: row.id,
    roomId: row.room_id,
    title: row.title,
    description: row.description,
    discountPercentage: row.discount_percentage,
    startDate: new Date(row.start_date),
    endDate: new Date(row.end_date),
    isActive: row.is_active,
    createdAt: new Date(row.created_at)
  };
}

function rowToDealWithRoom(row: any): DealWithRoom {
  const originalPrice = parseFloat(row.price);
  const discountPercentage = row.discount_percentage;
  const discountedPrice = originalPrice * (1 - discountPercentage / 100);

  return {
    id: row.id,
    roomId: row.room_id,
    title: row.title,
    description: row.description,
    discountPercentage: row.discount_percentage,
    startDate: new Date(row.start_date),
    endDate: new Date(row.end_date),
    isActive: row.is_active,
    createdAt: new Date(row.created_at),
    roomName: row.room_name,
    roomType: row.room_type,
    originalPrice,
    discountedPrice,
    images: row.images || [],
    maxGuests: row.max_guests,
    bedType: row.bed_type
  };
}
