const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Subscription = require('../models/Subscription');

// Create new order
router.post('/', async (req, res) => {
  try {
    const { orderId, service, serviceId, amount, payerEmail, payerName } = req.body;

    // Create order
    const order = new Order({
      orderId,
      service,
      serviceId,
      amount: parseFloat(amount),
      payerEmail,
      payerName,
      status: 'completed'
    });

    await order.save();

    // If subscription service, create subscription
    if (serviceId === 'social-media' || serviceId === 'seo-google') {
      const nextBilling = new Date();
      nextBilling.setMonth(nextBilling.getMonth() + 1);

      const subscription = new Subscription({
        orderId,
        billingCycle: 'monthly',
        nextBillingDate: nextBilling,
        status: 'active'
      });

      await subscription.save();
    }

    res.status(201).json({
      success: true,
      order,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order',
      message: error.message
    });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  }
});

// Get order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order'
    });
  }
});

module.exports = router;
