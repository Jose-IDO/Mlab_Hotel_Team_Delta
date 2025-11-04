import express from 'express';
import cors from 'cors';
import roomRoutes from './routes/roomRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
import eventRoutes from "./routes/eventRoutes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.get('/health', (_req, res) => {
  res.json({ ok: true, message: 'Server is running' });
});

app.use('/auth', authRoutes);
app.use('/admin/rooms', roomRoutes);
app.use('/admin/users', userRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/admin/events", eventRoutes);

// Error handling (must be last)
app.use(errorHandler);

export default app;