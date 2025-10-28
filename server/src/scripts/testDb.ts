import 'dotenv/config';
import pool from '../config/db';

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW() as now, current_database() as db;');
    console.log('✅ Database connected successfully!');
    console.log('   Time:', result.rows[0].now);
    console.log('   Database:', result.rows[0].db);
    await pool.end();
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();