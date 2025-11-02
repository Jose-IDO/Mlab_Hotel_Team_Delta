import { Router } from 'express';
import express from 'express';
import crypto from 'crypto';
import { authenticate, requireRole } from '../middleware/auth';
import { bookingRepository } from '../repositories/bookingRepository';
import { userRepository } from '../repositories/userRepository';
import { bookingService } from '../services/bookingService';
import { paymentRepository } from '../repositories/paymentRepository';
import { paymentController } from '../controllers/paymentController';
import { hotelSettingsRepository } from '../repositories/hotelSettingsRepository';

const router = Router();

// POST /payments/paystack/start
router.post('/paystack/start', authenticate, async (req, res) => {
  try {
    const { bookingId } = req.body as { bookingId: string };
    if (!bookingId) return res.status(400).json({ ok: false, error: 'Missing bookingId' });

    const booking = await bookingRepository.findById(bookingId);
    if (!booking) return res.status(404).json({ ok: false, error: 'Booking not found' });
    if (booking.status !== 'pending') return res.status(400).json({ ok: false, error: 'Booking is not pending' });
    if (booking.expiresAt && new Date(booking.expiresAt) < new Date()) {
      return res.status(400).json({ ok: false, error: 'Booking has expired' });
    }

    const user = await userRepository.findById(booking.userId);
    if (!user) return res.status(404).json({ ok: false, error: 'User not found' });

    // Fetch tax rate from settings
    let taxRate = 15; // Default 15%
    try {
      const settings = await hotelSettingsRepository.get();
      if (settings?.taxRate) {
        taxRate = settings.taxRate;
      }
    } catch (err) {
      console.warn('Failed to fetch tax rate, using default 15%:', err);
    }

    // Calculate grand total with tax
    const subtotal = Number(booking.totalPrice);
    const taxAmount = (subtotal * taxRate) / 100;
    const grandTotal = subtotal + taxAmount;

    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || 'http://localhost:5173';
    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).json({ ok: false, error: 'PAYSTACK_SECRET_KEY not configured' });
    }

    const amountMinor = Math.round(grandTotal * 100); // cents, including tax
    const reference = booking.paymentReference || `bk_${booking.id}`;

    // Persist reference on booking if not already set
    if (!booking.paymentReference || booking.paymentReference !== reference) {
      const updated = await bookingRepository.updatePaymentReference(booking.id, reference);
      if (updated) {
        console.log('✅ Stored payment reference on booking', { bookingId: booking.id, reference });
      } else {
        console.warn('⚠️ Failed to store payment reference on booking', { bookingId: booking.id, reference });
      }
    }

    // Create payment record with grand total including tax
    const payment = await paymentRepository.create({
      bookingId: booking.id,
      userId: booking.userId,
      amount: grandTotal,
      currency: 'ZAR',
      paymentMethod: 'paystack',
      paymentReference: reference,
    });
    console.log('💳 Created payment record', { paymentId: payment.id, reference, subtotal, taxRate, taxAmount, grandTotal });

    const callbackUrl = `${PUBLIC_BASE_URL}/booking-confirmation?ref=${encodeURIComponent(reference)}&reference=${encodeURIComponent(reference)}`;
    console.log('🔗 Paystack callback URL:', callbackUrl);

    const initRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
      body: JSON.stringify({
        email: user.email,
        amount: amountMinor,
        currency: 'ZAR',
        reference,
        callback_url: callbackUrl,
        metadata: {
          bookingId: booking.id,
          userId: booking.userId,
        },
      }),
    } as any);

    if (!initRes.ok) {
      const text = await initRes.text();
      return res.status(400).json({ ok: false, error: `Paystack init failed: ${text}` });
    }

    const data = await initRes.json();
    const authorizationUrl = data?.data?.authorization_url;
    const accessCode = data?.data?.access_code;

    if (!authorizationUrl) {
      return res.status(400).json({ ok: false, error: 'Missing authorization_url from Paystack' });
    }

    return res.json({ ok: true, data: { checkoutUrl: authorizationUrl, reference, accessCode } });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// POST /payments/paystack/webhook
router.post('/paystack/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY || '';
    const signature = req.headers['x-paystack-signature'] as string;
    const body = req.body as Buffer;

    if (!signature) return res.status(400).send('Missing signature');

    const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');
    if (hash !== signature) return res.status(400).send('Invalid signature');

    const event = JSON.parse(body.toString());
    const reference = event?.data?.reference as string | undefined;

    if (event?.event === 'charge.success' && reference) {
      // Update payment record to success
      await paymentRepository.updateByReference(reference, {
        status: 'success',
        paymentDate: new Date().toISOString(),
        gatewayResponse: event.data,
      });
      console.log('✅ Payment marked as success via webhook', { reference });

      // Confirm booking
      await bookingService.confirmByPaymentRef(reference);
    }

    res.status(200).send('ok');
  } catch (e: any) {
    res.status(400).send('webhook error');
  }
});

// GET /payments/paystack/verify?reference=...
router.get('/paystack/verify', authenticate, async (req, res) => {
  try {
    const reference = (req.query.reference as string) || (req.query.ref as string);
    if (!reference) return res.status(400).json({ ok: false, error: 'Missing reference' });

    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).json({ ok: false, error: 'PAYSTACK_SECRET_KEY not configured' });
    }

    // Verify transaction with Paystack
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}` },
    } as any);

    const body = await verifyRes.text();
    if (!verifyRes.ok) {
      return res.status(400).json({ ok: false, error: `Verify failed: ${body}` });
    }

    const payload = JSON.parse(body);
    const status = payload?.data?.status;

    if (status === 'success') {
      // Update payment record
      await paymentRepository.updateByReference(reference, {
        status: 'success',
        paymentDate: new Date().toISOString(),
        gatewayResponse: payload.data,
      });
      console.log('✅ Payment marked as success via verify', { reference });

      // Confirm booking by reference (idempotent)
      const confirmed = await bookingService.confirmByPaymentRef(reference);
      return res.json({ ok: true, data: { verified: true, booking: confirmed } });
    }

    return res.json({ ok: true, data: { verified: false, status } });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// Customer routes
router.get('/me', authenticate, paymentController.myPayments);
router.get('/:id', authenticate, paymentController.getById);
router.get('/booking/:bookingId', authenticate, paymentController.getByBookingId);

// Admin routes
router.get('/admin/all', authenticate, requireRole(['super_admin', 'hotel_manager']), paymentController.listAll);

export default router;
