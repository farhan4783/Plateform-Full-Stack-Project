import express from 'express';
import cors from 'cors';
import { initStore, getStore } from './store.js';
import aiRoutes from './routes/ai.js';
import menuRoutes from './routes/menu.js';
import analyticsRoutes from './routes/analytics.js';
import bookingRoutes from './routes/booking.js';
import ordersRoutes from './routes/orders.js';
import uploadRoutes from './routes/upload.js';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize in-memory data store
initStore();

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', name: 'Plateform AI Backend', version: '2.0.0' });
});

app.listen(PORT, () => {
    console.log(`\n🚀 Plateform AI Backend running on http://localhost:${PORT}\n`);
});
