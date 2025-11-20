import pool from '../config/db';
import * as fs from 'fs';
import * as path from 'path';

async function fixNotificationUuidTypes() {
  const client = await pool.connect();
  try {
    console.log('🔧 Fixing notification table to use UUID types...');
    
    const sql = fs.readFileSync(
      path.join(__dirname, '../sql/013_fix_notification_uuid_types.sql'),
      'utf8'
    );
    
    await client.query(sql);
    console.log('✅ Successfully updated notifications table to use UUID types!');
  } catch (error) {
    console.error('❌ Error fixing notification UUID types:', error);
    throw error;
  } finally {
    client.release();
  }
}

fixNotificationUuidTypes()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
