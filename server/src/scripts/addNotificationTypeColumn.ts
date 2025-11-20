import pool from '../config/db';

async function addNotificationTypeColumn() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Adding type column to notifications table...');

    await client.query('BEGIN');

    // Check if column exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'notifications' 
      AND column_name = 'type'
    `);

    if (checkColumn.rows.length === 0) {
      // Add type column
      await client.query(`
        ALTER TABLE notifications 
        ADD COLUMN type VARCHAR(50) DEFAULT 'general'
      `);
      console.log('✅ Added type column');

      // Create index
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type)
      `);
      console.log('✅ Created index on type column');

      // Update existing notifications
      await client.query(`
        UPDATE notifications 
        SET type = 'booking_confirmation' 
        WHERE booking_id IS NOT NULL AND type = 'general'
      `);
      console.log('✅ Updated existing notifications');

      await client.query('COMMIT');
      console.log('✅ Notification type migration completed successfully!');
    } else {
      console.log('ℹ️  Type column already exists');
      await client.query('ROLLBACK');
    }

  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to add type column:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

// Run if called directly
if (require.main === module) {
  addNotificationTypeColumn()
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

export { addNotificationTypeColumn };
