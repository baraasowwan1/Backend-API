```javascript
const mongoose = require('mongoose');

const customRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: String,
  company: String,
  serviceType: {
    type: String,
    required: true
  },
  budget: String,
  timeline: String,
  description: {
    type: String,
    required: true
  },
  additionalNotes: String,
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CustomRequest', customRequestSchema);
```
