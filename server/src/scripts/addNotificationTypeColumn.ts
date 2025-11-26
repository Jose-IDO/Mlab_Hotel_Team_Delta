import 'dotenv/config';
import pool from '../config/db';

async function addNotificationTypeColumn() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Adding type column to notifications table...');
    
    await client.query('BEGIN');
    
    // Check if column exists
    const checkResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'notifications' 
      AND column_name = 'type'
    `);
    
    if (checkResult.rows.length === 0) {
      // Add type column
      await client.query(`
        ALTER TABLE notifications 
        ADD COLUMN type VARCHAR(50) DEFAULT 'general'
      `);
      
      // Create index
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type)
      `);
      
      console.log('✅ Added type column to notifications table');
    } else {
      console.log('ℹ️  Type column already exists');
    }
    
    await client.query('COMMIT');
    console.log('✅ Migration completed successfully');
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to add type column:', err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

addNotificationTypeColumn();
