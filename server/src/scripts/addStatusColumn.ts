import pool from '../config/db';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function addStatusColumn() {
  try {
    console.log('Adding status column to rooms table...');
    
    // Read the migration SQL file
    const sqlPath = path.join(__dirname, '../sql/002_add_status_column.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    
    // Execute the migration
    await pool.query(sql);
    
    console.log('✅ Status column added successfully!');
    console.log('   - Added status column with default value "active"');
    console.log('   - Updated existing rooms to "active" status');
    console.log('   - Created index for better query performance');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding status column:', error);
    process.exit(1);
  }
}

addStatusColumn();
