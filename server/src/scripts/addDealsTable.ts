import pool from '../config/db';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  try {
    console.log('Running deals table migration...');
    
    const sqlPath = path.join(__dirname, '../sql/011_add_deals_table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await pool.query(sql);
    
    console.log('✅ Deals table migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
