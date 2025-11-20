import { Router } from 'express';
import pool from '../config/db';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();

// Admin-only endpoint to run database migrations
router.post('/run-uuid-migration', async (req, res) => {
  try {
    console.log('🔧 Running UUID migration...');
    
    const sql = fs.readFileSync(
      path.join(__dirname, '../sql/013_fix_notification_uuid_types.sql'),
      'utf8'
    );
    
    await pool.query(sql);
    
    console.log('✅ Successfully updated notifications table to use UUID types!');
    res.json({ ok: true, message: 'Migration completed successfully' });
  } catch (error: any) {
    console.error('❌ Error running migration:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
