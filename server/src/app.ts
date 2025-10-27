import express from 'express';
import cors from 'cors';
import roomRoutes from './routes/roomRoutes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.get('/health', (_req, res) => {
  res.json({ ok: true, message: 'Server is running' });
});

app.use('/admin/rooms', roomRoutes);

// Error handling (must be last)
app.use(errorHandler);

export default app;