const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const ordersRouter = require('./routes/orders');
const requestsRouter = require('./routes/requests');
const subscriptionsRouter = require('./routes/subscriptions');
const adminRouter = require('./routes/admin');
const websiteBuilderRouter = require('./routes/websiteBuilder');
const websitesRouter = require('./routes/websites');

// Mount routes
app.use('/api/orders', ordersRouter);
app.use('/api/custom-requests', requestsRouter);
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/website-builder', websiteBuilderRouter);
app.use('/api/websites', websitesRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'SowwanPay API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✓ Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('✗ MongoDB connection error:', err);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});
