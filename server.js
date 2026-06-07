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
const websitesRouter = require('./routes/websites');  // ← Should appear ONCE

// Mount routes
app.use('/api/orders', ordersRouter);
app.use('/api/custom-requests', requestsRouter);
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/website-builder', websiteBuilderRouter);
app.use('/api/websites', websitesRouter);  // ← Should appear ONCE
