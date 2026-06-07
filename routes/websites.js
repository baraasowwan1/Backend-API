const express = require('express');
const router = express.Router();
const PublishedWebsite = require('../models/PublishedWebsite');

// Get all websites for a user
router.get('/', async (req, res) => {
  try {
    const { ownerId } = req.query;
    const websites = await PublishedWebsite.find({ ownerId }).sort({ createdAt: -1 });
    res.json({ success: true, websites });
  } catch (error) {
    console.error('Error fetching websites:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch websites' });
  }
});

// Create new website
router.post('/', async (req, res) => {
  try {
    const { ownerId, ownerEmail, siteName } = req.body;
    const websiteId = 'site_' + Date.now();
    const subdomain = siteName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();

    const website = new PublishedWebsite({
      websiteId,
      ownerId,
      ownerEmail,
      siteName,
      subdomain,
      pages: [{ pageId: 'home', name: 'Home', path: '/', components: [] }]
    });

    await website.save();
    res.status(201).json({ success: true, website });
  } catch (error) {
    console.error('Error creating website:', error);
    res.status(500).json({ success: false, error: 'Failed to create website' });
  }
});

// Update website
router.put('/:websiteId', async (req, res) => {
  try {
    const { pages, settings } = req.body;
    const website = await PublishedWebsite.findOneAndUpdate(
      { websiteId: req.params.websiteId },
      { pages, settings, lastModified: new Date() },
      { new: true }
    );
    res.json({ success: true, website });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update' });
  }
});

// Publish website
router.post('/:websiteId/publish', async (req, res) => {
  try {
    const { paymentId } = req.body;
    const website = await PublishedWebsite.findOneAndUpdate(
      { websiteId: req.params.websiteId },
      { status: 'published', publishedAt: new Date() },
      { new: true }
    );
    
    const url = `https://${website.subdomain}.sowwanpay.com`;
    res.json({ success: true, url, website });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to publish' });
  }
});

module.exports = router;
