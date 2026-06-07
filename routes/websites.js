const express = require('express');
const router = express.Router();
const PublishedWebsite = require('../models/PublishedWebsite');

// Get all websites for a user
router.get('/', async (req, res) => {
  try {
    const { ownerId } = req.query;
    
    if (!ownerId) {
      return res.status(400).json({
        success: false,
        error: 'Owner ID is required'
      });
    }

    const websites = await PublishedWebsite.find({ ownerId })
      .sort({ createdAt: -1 });

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

// Get single website
router.get('/:websiteId', async (req, res) => {
  try {
    const website = await PublishedWebsite.findOne({ 
      websiteId: req.params.websiteId 
    });

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

// Create new website
router.post('/', async (req, res) => {
  try {
    const { ownerId, ownerEmail, siteName } = req.body;

    const websiteId = 'site_' + Date.now();
    
    // Generate subdomain from site name
    let subdomain = siteName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Make subdomain unique
    subdomain = subdomain + '-' + Date.now();

    const website = new PublishedWebsite({
      websiteId,
      ownerId,
      ownerEmail,
      siteName,
      subdomain,
      pages: [{
        pageId: 'home',
        name: 'Home',
        path: '/',
        components: [],
        metaTitle: siteName
      }],
      status: 'draft'
    });

    await website.save();

    res.status(201).json({
      success: true,
      website,
      message: 'Website created successfully'
    });
  } catch (error) {
    console.error('Error creating website:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create website',
      message: error.message
    });
  }
});

// Update website
router.put('/:websiteId', async (req, res) => {
  try {
    const { pages, settings, siteName } = req.body;

    const website = await PublishedWebsite.findOneAndUpdate(
      { websiteId: req.params.websiteId },
      { 
        pages, 
        settings, 
        siteName,
        lastModified: new Date()
      },
      { new: true }
    );

    if (!website) {
      return res.status(404).json({
        success: false,
        error: 'Website not found'
      });
    }

    res.json({
      success: true,
      website,
      message: 'Website updated successfully'
    });
  } catch (error) {
    console.error('Error updating website:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update website'
    });
  }
});

// Publish website
router.post('/:websiteId/publish', async (req, res) => {
  try {
    const { paymentId } = req.body;

    const website = await PublishedWebsite.findOneAndUpdate(
      { websiteId: req.params.websiteId },
      { 
        status: 'published', 
        publishedAt: new Date(),
        'plan.type': 'starter',
        'plan.status': 'active'
      },
      { new: true }
    );

    if (!website) {
      return res.status(404).json({
        success: false,
        error: 'Website not found'
      });
    }

    const url = `https://${website.subdomain}.sowwanpay.com`;
    
    res.json({
      success: true,
      url,
      website,
      message: 'Website published successfully'
    });
  } catch (error) {
    console.error('Error publishing website:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to publish website'
    });
  }
});

// Delete website
router.delete('/:websiteId', async (req, res) => {
  try {
    const website = await PublishedWebsite.findOneAndDelete({
      websiteId: req.params.websiteId
    });

    if (!website) {
      return res.status(404).json({
        success: false,
        error: 'Website not found'
      });
    }

    res.json({
      success: true,
      message: 'Website deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting website:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete website'
    });
  }
});

module.exports = router;
