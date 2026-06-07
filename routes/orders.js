router.post('/', async (req, res) => {
  try {
    const { orderId, service, serviceId, amount, payerEmail, payerName } = req.body;

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
