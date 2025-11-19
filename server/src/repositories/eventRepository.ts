import pool from "../config/db";


interface EventInput {
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
}

interface EventUpdate {
  title?: string;
  date?: string;
  description?: string;
  imageUrl?: string;
}

function rowToEvent(row: any) {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    description: row.description,
    imageUrl: row.image_url
  };
}

export const eventRepository = {
  findAll: async () => {
    const { rows } = await pool.query("SELECT * FROM events ORDER BY id DESC");
    return rows.map(rowToEvent);
  },

  findById: async (id: string) => {
    const { rows } = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
    return rows[0] ? rowToEvent(rows[0]) : null;
  },

  create: async (event: EventInput) => {
    const { title, date, description, imageUrl } = event;
    const { rows } = await pool.query(
      `INSERT INTO events (title, date, description, image_url)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, date, description, imageUrl]
    );
    return rowToEvent(rows[0]);
  },

  update: async (id: string, updates: EventUpdate) => {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (updates.title !== undefined) {
      fields.push(`title = $${idx++}`);
      values.push(updates.title);
    }
    if (updates.date !== undefined) {
      fields.push(`date = $${idx++}`);
      values.push(updates.date);
    }
    if (updates.description !== undefined) {
      fields.push(`description = $${idx++}`);
      values.push(updates.description);
    }
    if (updates.imageUrl !== undefined) {
      fields.push(`image_url = $${idx++}`);
      values.push(updates.imageUrl);
    }

    if (fields.length === 0) {
      return await eventRepository.findById(id);
    }

    values.push(id);
    const { rows } = await pool.query(
      `UPDATE events SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    return rows[0] ? rowToEvent(rows[0]) : null;
  },

  delete: async (id: string) => {
    await pool.query("DELETE FROM events WHERE id = $1", [id]);
  },
};