const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function fixNotificationUuidTypes() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'hotel_booking_db'
  });
  
  try {
    console.log('🔧 Fixing notification table to use UUID types...');
    
    const sql = fs.readFileSync(
      path.join(__dirname, '../sql/013_fix_notification_uuid_types.sql'),
      'utf8'
    );
    
    await pool.query(sql);
    console.log('✅ Successfully updated notifications table to use UUID types!');
  } catch (error) {
    console.error('❌ Error fixing notification UUID types:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

fixNotificationUuidTypes()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
