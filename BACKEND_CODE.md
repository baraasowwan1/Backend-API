# Complete Backend Server Code

Copy these files to create your Node.js/Express backend server.

---

## 📁 File: `.env.example`

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sowwanpay?retryWrites=true&w=majority

# Server
PORT=10000
NODE_ENV=production

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$... (generate with bcrypt)

# SendGrid Email
SENDGRID_API_KEY=SG.your_sendgrid_api_key
EMAIL_FROM=noreply@sowwanpay.com
EMAIL_TO=sowwanpay@gmail.com

# Frontend URLs
FRONTEND_URL=https://sowwanpay.com
ADMIN_URL=https://admin.sowwanpay.com

# CORS
CORS_ORIGINS=https://sowwanpay.com,https://admin.sowwanpay.com
```

---

## 📁 File: `.gitignore`

```
node_modules/
.env
.env.local
.DS_Store
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
dist/
build/
```

---

## 📁 File: `config/database.js`

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

## 📁 File: `models/Order.js`

```javascript
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  service: {
    type: String,
    required: true
  },
  serviceId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'cancelled'],
    default: 'completed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
```

---

## 📁 File: `models/CustomRequest.js`

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

---

## 📁 File: `models/Subscription.js`

```javascript
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    ref: 'Order'
  },
  billingCycle: {
    type: String,
    default: 'monthly'
  },
  nextBillingDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'cancelled'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
```

---

## 📁 File: `models/WebsitePage.js`

```javascript
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
```

---

## 📁 File: `routes/orders.js`

```javascript
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Subscription = require('../models/Subscription');

// Create new order
router.post('/', async (req, res) => {
  try {
    const { orderId, service, serviceId, amount } = req.body;

    // Create order
    const order = new Order({
      orderId,
      service,
      serviceId,
      amount: parseFloat(amount),
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
```

---

## 📁 File: `routes/requests.js`

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

---

## 📁 File: `routes/subscriptions.js`

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

---

## 📁 File: `routes/admin.js`

```javascript
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check username
    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: { username }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// Verify token (protected route example)
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    res.json({
      success: true,
      user: decoded
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

module.exports = router;
```

---

## 📁 File: `routes/websiteBuilder.js`

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

---

## 📁 File: `utils/email.js`

```javascript
const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendCustomRequestEmail(requestData) {
  const msg = {
    to: process.env.EMAIL_TO,
    from: process.env.EMAIL_FROM,
    subject: `New Custom Website Request from ${requestData.name}`,
    text: `
New Custom Website Request

Name: ${requestData.name}
Email: ${requestData.email}
Phone: ${requestData.phone || 'Not provided'}
Company: ${requestData.company || 'Not provided'}

Service Type: ${requestData.serviceType}
Budget: ${requestData.budget}
Timeline: ${requestData.timeline}

Description:
${requestData.description}

Additional Notes:
${requestData.additionalNotes || 'None'}

Request ID: ${requestData.requestId}
Submitted: ${new Date(requestData.createdAt).toLocaleString()}
    `,
    html: `
      <h2>New Custom Website Request</h2>
      
      <h3>Client Information</h3>
      <ul>
        <li><strong>Name:</strong> ${requestData.name}</li>
        <li><strong>Email:</strong> <a href="mailto:${requestData.email}">${requestData.email}</a></li>
        <li><strong>Phone:</strong> ${requestData.phone || 'Not provided'}</li>
        <li><strong>Company:</strong> ${requestData.company || 'Not provided'}</li>
      </ul>

      <h3>Project Details</h3>
      <ul>
        <li><strong>Service Type:</strong> ${requestData.serviceType}</li>
        <li><strong>Budget:</strong> ${requestData.budget}</li>
        <li><strong>Timeline:</strong> ${requestData.timeline}</li>
      </ul>

      <h3>Description</h3>
      <p>${requestData.description.replace(/\n/g, '<br>')}</p>

      ${requestData.additionalNotes ? `
        <h3>Additional Notes</h3>
        <p>${requestData.additionalNotes.replace(/\n/g, '<br>')}</p>
      ` : ''}

      <hr>
      <p style="color: #666; font-size: 12px;">
        Request ID: ${requestData.requestId}<br>
        Submitted: ${new Date(requestData.createdAt).toLocaleString()}
      </p>
    `
  };

  await sgMail.send(msg);
  console.log(`✅ Email sent for request ${requestData.requestId}`);
}

module.exports = {
  sendCustomRequestEmail
};
```

---

## 🚀 How to Use These Files

1. Create a new directory: `sowwanpay-backend`
2. Copy each file above to the correct location
3. Run `npm install`
4. Create `.env` file with your credentials
5. Test locally: `npm run dev`
6. Push to GitHub
7. Deploy to Render

**See MONGODB_RENDER_SETUP.md for complete deployment instructions!**
