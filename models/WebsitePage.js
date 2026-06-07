const mongoose = require('mongoose');

const websitePageSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
    index: true
  },
  pages: {
    type: Array,
    default: []
  },
  siteName: {
    type: String,
    default: 'My Website'
  },
  customDomain: String,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WebsitePage', websitePageSchema);
