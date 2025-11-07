import pool from "../config/db";


interface EventInput {
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
}

export const eventRepository = {
  findAll: async () => {
    const { rows } = await pool.query("SELECT * FROM events ORDER BY id DESC");
    return rows;
  },

  create: async (event: EventInput) => {
    const { title, date, description, imageUrl } = event;
    const { rows } = await pool.query(
      `INSERT INTO events (title, date, description, image_url)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, date, description, imageUrl]
    );
    return rows[0];
  },

  delete: async (id: string) => {
    await pool.query("DELETE FROM events WHERE id = $1", [id]);
  },

  update: async (id: string, event: EventInput) => {
    const { title, date, description, imageUrl } = event;
    
    // If imageUrl is provided, update it; otherwise keep existing
    const query = imageUrl
      ? `UPDATE events SET title = $1, date = $2, description = $3, image_url = $4 WHERE id = $5 RETURNING *`
      : `UPDATE events SET title = $1, date = $2, description = $3 WHERE id = $4 RETURNING *`;
    
    const params = imageUrl
      ? [title, date, description, imageUrl, id]
      : [title, date, description, id];
    
    const { rows } = await pool.query(query, params);
    return rows[0];
  },
};