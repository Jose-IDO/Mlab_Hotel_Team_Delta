import pool from '../config/db';
import { Room, RoomPayload } from '../types/room.types';

function rowToRoom(row: any): Room {
  return {
    id: row.id,
    roomName: row.room_name,
    roomType: row.room_type,
    price: Number(row.price),
    maxGuests: row.max_guests,
    bedType: row.bed_type,
    numberOfBeds: row.number_of_beds,
    roomSizeSqm: Number(row.room_size_sqm),
    amenities: row.amenities || [],
    units: row.units || []
  };
}

class RoomRepository {
  async findAll(): Promise<Room[]> {
    const sql = `
      SELECT r.*,
             COALESCE(
               JSON_AGG(
                 JSON_BUILD_OBJECT('unitNumber', ru.unit_number)
               ) FILTER (WHERE ru.id IS NOT NULL),
               '[]'
             ) AS units
      FROM rooms r
      LEFT JOIN room_units ru ON ru.room_id = r.id
      GROUP BY r.id
      ORDER BY r.created_at DESC;
    `;
    const { rows } = await pool.query(sql);
    return rows.map(rowToRoom);
  }

  async findById(id: string): Promise<Room | undefined> {
    const sql = `
      SELECT r.*,
             COALESCE(
               JSON_AGG(
                 JSON_BUILD_OBJECT('unitNumber', ru.unit_number)
               ) FILTER (WHERE ru.id IS NOT NULL),
               '[]'
             ) AS units
      FROM rooms r
      LEFT JOIN room_units ru ON ru.room_id = r.id
      WHERE r.id = $1
      GROUP BY r.id;
    `;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] ? rowToRoom(rows[0]) : undefined;
  }

  async create(payload: RoomPayload): Promise<Room> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const insertRoom = `
        INSERT INTO rooms
          (room_name, room_type, price, max_guests, bed_type, number_of_beds, room_size_sqm, amenities)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *;
      `;
      const roomValues = [
        payload.roomName,
        payload.roomType,
        payload.price,
        payload.maxGuests || 1,
        payload.bedType || 'unknown',
        payload.numberOfBeds || 1,
        payload.roomSizeSqm || 0,
        (payload.amenities || []) as any
      ];
      const roomRes = await client.query(insertRoom, roomValues);
      const roomRow = roomRes.rows[0];

      if (payload.units?.length) {
        const insertUnits = `
          INSERT INTO room_units (room_id, unit_number)
          SELECT $1, x.unit_number FROM JSON_TO_RECORDSET($2::json) AS x(unit_number TEXT);
        `;
        const unitsJson = JSON.stringify(
          payload.units.map(u => ({ unit_number: u.unitNumber }))
        );
        await client.query(insertUnits, [roomRow.id, unitsJson]);
      }

      await client.query('COMMIT');
      return (await this.findById(roomRow.id)) as Room;
    } catch (e) {
      await pool.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async update(id: string, updates: Partial<RoomPayload>): Promise<Room | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const map: Record<string, any> = {
      room_name: updates.roomName,
      room_type: updates.roomType,
      price: updates.price,
      max_guests: updates.maxGuests,
      bed_type: updates.bedType,
      number_of_beds: updates.numberOfBeds,
      room_size_sqm: updates.roomSizeSqm,
      amenities: updates.amenities
    };

    for (const [col, val] of Object.entries(map)) {
      if (val !== undefined) {
        fields.push(`${col} = $${idx++}`);
        values.push(col === 'price' || col === 'room_size_sqm' ? Number(val) : val);
      }
    }

    if (!fields.length) {
      const existing = await this.findById(id);
      return existing ?? null;
    }

    const sql = `UPDATE rooms SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *;`;
    values.push(id);
    const { rows } = await pool.query(sql, values);
    if (!rows[0]) return null;
    return (await this.findById(id)) as Room;
  }

  async delete(id: string): Promise<boolean> {
    const { rowCount } = await pool.query('DELETE FROM rooms WHERE id = $1;', [id]);
    return (rowCount ?? 0) > 0;
  }
}

export const roomRepository = new RoomRepository();