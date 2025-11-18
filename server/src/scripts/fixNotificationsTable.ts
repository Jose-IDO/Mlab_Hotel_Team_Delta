import 'dotenv/config';
import pool from '../config/db';

async function fixNotificationsTable() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Fixing notifications table schema...');
    
    await client.query('BEGIN');
    
    // Drop the existing table if it exists
    await client.query(`DROP TABLE IF EXISTS notifications CASCADE;`);
    
    // Create notifications table with correct UUID types
    await client.query(`
      CREATE TABLE notifications (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL,
        message TEXT NOT NULL,
        booking_id UUID,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log('✅ Notifications table fixed with UUID columns!');
    
    await client.query('COMMIT');
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to fix notifications table:', err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

fixNotificationsTable();
