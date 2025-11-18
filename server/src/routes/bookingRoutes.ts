import { Router } from 'express';
import express from 'express';
import { bookingController } from '../controllers/bookingController';
import { bookingService } from '../services/bookingService';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// Customer
router.post('/', authenticate, bookingController.create);
router.get('/me', authenticate, bookingController.myBookings);
router.get('/my-bookings', authenticate, bookingController.myBookings);
router.get('/by-reference/:reference', authenticate, bookingController.getByReference);
router.patch('/:id/cancel', authenticate, bookingController.cancelBooking);

// Public - booked dates (for date pickers / availability views)
router.get('/booked-dates', bookingController.bookedDates);

// Admin
router.get('/admin', authenticate, requireRole(['super_admin','hotel_manager']), bookingController.listAll);
router.patch('/:id/status', authenticate, requireRole(['super_admin','hotel_manager']), bookingController.updateStatus);
router.get('/admin/availability', authenticate, requireRole(['super_admin','hotel_manager']), bookingController.availability);

// Webhook placeholder (replace with yojjur gateway)
router.post('/webhooks/payment', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Verify signature with provider SDK here
    // Extract paymentRef from event, e.g., intent.id
    const paymentRef = req.query.ref as string || ''; // placeholder; parse from event payload instead
    if (!paymentRef) return res.status(400).send('Missing payment reference');

    await bookingService.confirmByPaymentRef(paymentRef);
    res.status(200).send('ok');
  } catch (e: any) {
    res.status(400).send('webhook error');
  }
});

export default router;