const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  service: {
    type: String,
    required: true
  },
  serviceId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  payerEmail: String,
  payerName: String,
  status: {
    type: String,
    enum: ['completed', 'pending', 'cancelled', 'refunded'],
    default: 'completed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
