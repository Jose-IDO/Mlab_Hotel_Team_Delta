import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import pool from '../config/db';

async function migrate() {
  const sqlFile = path.join(__dirname, '../../sql/001_init.sql');
  
  if (!fs.existsSync(sqlFile)) {
    console.error('❌ SQL file not found:', sqlFile);
    console.log('   Create the file first at: server/sql/001_init.sql');
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlFile, 'utf8');

  const client = await pool.connect();
  try {
    console.log('🔄 Running migration...');
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('✅ Migration completed successfully!');
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