import pool from '../config/db';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('Running migration: Add images column to rooms table...');
    
    const sqlPath = path.join(__dirname, '../sql/010_add_room_images.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    
    await client.query(sql);
    
    console.log('✅ Migration completed successfully!');
    console.log('Added images column to rooms table');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(console.error);
