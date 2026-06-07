```javascript
const express = require('express');
const router = express.Router();
const WebsitePage = require('../models/WebsitePage');

// Save website pages
router.post('/pages', async (req, res) => {
  try {
    const { clientId, pages, siteName, customDomain } = req.body;
    
    // Find existing or create new
    let website = await WebsitePage.findOne({ clientId });
    
    if (website) {
      website.pages = pages;
      website.siteName = siteName;
      website.customDomain = customDomain;
      website.updatedAt = new Date();
      await website.save();
    } else {
      website = new WebsitePage({
        clientId: clientId || 'client_' + Date.now(),
        pages,
        siteName,
        customDomain
      });
      await website.save();
    }

    res.json({
      success: true,
      clientId: website.clientId,
      message: 'Website saved successfully'
    });
  } catch (error) {
    console.error('Error saving website:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save website'
    });
  }
});

// Get website pages
router.get('/pages/:clientId', async (req, res) => {
  try {
    const website = await WebsitePage.findOne({ clientId: req.params.clientId });
    
    if (!website) {
      return res.status(404).json({
        success: false,
        error: 'Website not found'
      });
    }

    res.json({
      success: true,
      website
    });
  } catch (error) {
    console.error('Error fetching website:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch website'
    });
  }
});

// Get all websites (admin)
router.get('/pages', async (req, res) => {
  try {
    const websites = await WebsitePage.find().sort({ updatedAt: -1 });
    res.json({
      success: true,
      websites
    });
  } catch (error) {
    console.error('Error fetching websites:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch websites'
    });
  }
});

module.exports = router;
```
