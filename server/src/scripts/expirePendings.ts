import 'dotenv/config';
import { bookingService } from '../services/bookingService';
import pool from '../config/db';

(async () => {
  try {
    const n = await bookingService.cancelExpiredPendings();
    console.log(`Cancelled ${n} expired pending bookings`);
  } catch (e: any) {
    console.error(e);
  } finally {
    await pool.end();
  }
})();