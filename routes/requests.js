```javascript
const express = require('express');
const router = express.Router();
const CustomRequest = require('../models/CustomRequest');
const { sendCustomRequestEmail } = require('../utils/email');

// Create custom request
router.post('/', async (req, res) => {
  try {
    const requestId = 'REQ_' + Date.now();

    const customRequest = new CustomRequest({
      requestId,
      ...req.body,
      status: 'pending'
    });

    await customRequest.save();

    // Send email notification
    try {
      await sendCustomRequestEmail(customRequest);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      requestId,
      message: 'Request submitted successfully'
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit request',
      message: error.message
    });
  }
});

// Get all custom requests
router.get('/', async (req, res) => {
  try {
    const requests = await CustomRequest.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch requests'
    });
  }
});

// Update request status
router.patch('/:requestId/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const request = await CustomRequest.findOneAndUpdate(
      { requestId: req.params.requestId },
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found'
      });
    }

    res.json({
      success: true,
      request
    });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update request'
    });
  }
});

module.exports = router;
```
