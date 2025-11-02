import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import pool from '../config/db';

async function migrate() {
  const sqlFile = path.join(__dirname, '../sql/005_add_booking_payment_fields.sql');
  
  if (!fs.existsSync(sqlFile)) {
    console.error('❌ SQL file not found:', sqlFile);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlFile, 'utf8');

  const client = await pool.connect();
  try {
    console.log('🔄 Running migration: Add payment fields to bookings...');
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('✅ Migration completed successfully!');
    console.log('✅ Added: payment_reference, expires_at columns');
    console.log('✅ Added: indexes for payment reference and expires_at');
    console.log('✅ Updated: status default to pending');
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
