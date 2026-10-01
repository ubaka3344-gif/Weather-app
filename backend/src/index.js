import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import weatherRoutes from './routes/weatherRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend dev server
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SkyPulse Weather API', timestamp: new Date().toISOString() });
});

// Weather API routes
app.use('/api', weatherRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'API route not found' });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('[SkyPulse Backend Error]:', err.message || err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error occurred while fetching weather data.',
  });
});

app.listen(PORT, () => {
  console.log(`SkyPulse Weather Backend is running on http://localhost:${PORT}`);
});
