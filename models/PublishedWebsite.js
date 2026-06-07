const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  componentId: String,
  type: String,
  props: mongoose.Schema.Types.Mixed,
  order: Number
});

const pageSchema = new mongoose.Schema({
  pageId: String,
  name: String,
  path: String,
  components: [componentSchema],
  metaTitle: String,
  metaDescription: String
});

const publishedWebsiteSchema = new mongoose.Schema({
  websiteId: { type: String, required: true, unique: true },
  ownerId: String,
  ownerEmail: String,
  siteName: String,
  subdomain: { type: String, unique: true, sparse: true },
  customDomain: String,
  
  plan: {
    type: { type: String, enum: ['free', 'starter', 'pro', 'enterprise'], default: 'free' },
    subscriptionId: String,
    status: String,
    nextBillingDate: Date
  },
  
  pages: [pageSchema],
  
  settings: {
    primaryColor: { type: String, default: '#3B82F6' },
    secondaryColor: String,
    logo: String,
    favicon: String,
    googleAnalytics: String
  },
  
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  publishedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

publishedWebsiteSchema.index({ subdomain: 1 });
publishedWebsiteSchema.index({ ownerId: 1 });

module.exports = mongoose.model('PublishedWebsite', publishedWebsiteSchema);
