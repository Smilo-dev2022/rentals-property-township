// Kasi Rentals Backend - Node.js + Express + MongoDB (Mongoose)
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
// NOTE: mongodb-memory-server is ESM-only in recent versions; use dynamic import below
const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const userRoutes = require('./routes/users');
const regionRoutes = require('./routes/regions');

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection (with optional in-memory fallback)
const connectToDatabase = async () => {
  const shouldUseMemory = process.env.MONGO_USE_MEMORY === 'true';
  const fallbackUri = 'mongodb://localhost:27017/ekasi-rentals';
  let mongoUri = process.env.MONGO_URI || fallbackUri;
  let memoryServer;

  try {
    if (shouldUseMemory) {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      mongoUri = memoryServer.getUri();
      console.log('Using in-memory MongoDB instance');
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB connected successfully');
    return { memoryServer };
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/regions', regionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'eKasi Rentals API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Server Start (after DB connection)
const PORT = process.env.PORT || 5000;
const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 eKasi Rentals server running on port ${PORT}`);
  });
};

start();