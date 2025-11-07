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
};