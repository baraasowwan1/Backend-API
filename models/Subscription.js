const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    ref: 'Order'
  },
  billingCycle: {
    type: String,
    default: 'monthly'
  },
  nextBillingDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'cancelled'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);

