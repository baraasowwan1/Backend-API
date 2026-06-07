```javascript
const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const Order = require('../models/Order');

// Get all subscriptions with order details
router.get('/', async (req, res) => {
  try {
    const subscriptions = await Subscription.find().sort({ createdAt: -1 });
    
    // Populate with order details
    const subscriptionsWithOrders = await Promise.all(
      subscriptions.map(async (sub) => {
        const order = await Order.findOne({ orderId: sub.orderId });
        return {
          ...sub.toObject(),
          order: order ? order.toObject() : null
        };
      })
    );

    res.json({
      success: true,
      subscriptions: subscriptionsWithOrders
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subscriptions'
    });
  }
});

// Update subscription status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }

    res.json({
      success: true,
      subscription
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update subscription'
    });
  }
});

// Get subscription by order ID
router.get('/order/:orderId', async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ orderId: req.params.orderId });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }

    res.json({
      success: true,
      subscription
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subscription'
    });
  }
});

module.exports = router;
```
