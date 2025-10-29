import pool from '../config/db';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function runUsersMigration() {
  try {
    console.log('Running users migration...');
    
    // Read the migration SQL file
    const sqlPath = path.join(__dirname, '../sql/003_add_users.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    
    // Execute the migration
    await pool.query(sql);
    
    console.log('✅ Users migration completed successfully!');
    console.log('   - Created users table');
    console.log('   - Created oauth_accounts table');
    console.log('   - Created roles table');
    console.log('   - Created user_roles table');
    console.log('   - Pre-populated roles: super_admin, hotel_manager, support_agent, customer');
    console.log('   - Added triggers for auto-assigning customer role');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running users migration:', error);
    process.exit(1);
  }
}

runUsersMigration();
