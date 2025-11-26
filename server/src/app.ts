import express from 'express';
import cors from 'cors';
import passport from './config/passport';
import roomRoutes from './routes/roomRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import profileRoutes from './routes/profileRoutes';
import bookingRoutes from './routes/bookingRoutes';
import paymentsRoutes from './routes/paymentsRoutes';
import hotelSettingsRoutes from './routes/hotelSettingsRoutes';
import dealRoutes from './routes/dealRoutes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
import eventRoutes from "./routes/eventRoutes";
import notificationRoutes from './routes/NotificationRoute';
import migrationRoutes from './routes/migrationRoutes';

const app = express();

// Middleware
const allowedOrigins = [
  process.env.PUBLIC_BASE_URL || 'http://localhost:5173',
  'http://localhost:5173', // Keep for local dev
  'https://mlab-hotel-deam-delta.vercel.app' // Production frontend URL
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());
app.use(logger);

// Routes
app.get('/health', (_req, res) => {
  res.json({ ok: true, message: 'Server is running' });
});

app.use('/auth', authRoutes);
app.use('/admin/rooms', roomRoutes);
app.use('/admin/users', userRoutes);
app.use('/users', profileRoutes);
app.use('/admin/deals', dealRoutes);
app.use('/deals', dealRoutes);
app.use('/bookings', bookingRoutes);
app.use('/payments', paymentsRoutes);
app.use('/settings', hotelSettingsRoutes);
app.use("/admin/events", eventRoutes);
app.use('/notifications', notificationRoutes);
app.use('/admin/migrations', migrationRoutes);

app.use(errorHandler);

export default app;