# Test Your MongoDB Connection

## Quick Test Script

Create a file called `test-mongodb.js` in your `sowwanpay-backend` directory:

```javascript
// test-mongodb.js
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://broosowwan_db_user:Admin123@cluster0.e6jjdnv.mongodb.net/sowwanpay?retryWrites=true&w=majority&appName=Cluster0';

console.log('🔄 Connecting to MongoDB...');
console.log('📍 Cluster: cluster0.e6jjdnv.mongodb.net');
console.log('👤 User: broosowwan_db_user');
console.log('🗄️  Database: sowwanpay\n');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ SUCCESS! MongoDB Connected!');
  console.log('📊 Connection Details:');
  console.log('   - Host:', mongoose.connection.host);
  console.log('   - Database:', mongoose.connection.name);
  console.log('   - Ready State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected');

  // Create a test document
  console.log('\n🧪 Testing write operation...');

  const TestSchema = new mongoose.Schema({
    message: String,
    timestamp: Date
  });

  const Test = mongoose.model('Test', TestSchema);

  const testDoc = new Test({
    message: 'MongoDB connection test successful!',
    timestamp: new Date()
  });

  return testDoc.save();
})
.then((doc) => {
  console.log('✅ Write operation successful!');
  console.log('📄 Test document created with ID:', doc._id);
  console.log('\n🎉 Your MongoDB setup is working perfectly!\n');
  
  process.exit(0);
})
.catch((error) => {
  console.error('\n❌ ERROR: MongoDB Connection Failed!');
  console.error('📝 Error Message:', error.message);
  console.error('\n🔍 Troubleshooting:');
  console.error('1. Check your internet connection');
  console.error('2. Verify MongoDB Atlas user credentials');
  console.error('3. Ensure IP whitelist includes 0.0.0.0/0');
  console.error('4. Check if cluster is active in MongoDB Atlas\n');

  process.exit(1);
});
```

## How to Run

```bash
# 1. Install mongoose (if not already installed)
npm install mongoose

# 2. Run the test
node test-mongodb.js
```

## Expected Output (Success)

```
🔄 Connecting to MongoDB...
📍 Cluster: cluster0.e6jjdnv.mongodb.net
👤 User: broosowwan_db_user
🗄️  Database: sowwanpay

✅ SUCCESS! MongoDB Connected!
📊 Connection Details:
   - Host: cluster0-shard-00-00.e6jjdnv.mongodb.net
   - Database: sowwanpay
   - Ready State: Connected

🧪 Testing write operation...
✅ Write operation successful!
📄 Test document created with ID: 507f1f77bcf86cd799439011

🎉 Your MongoDB setup is working perfectly!
```

## If You See Errors

### Error: "Authentication failed"
- Check username: `broosowwan_db_user`
- Check password: `Admin123`
- Verify user exists in MongoDB Atlas

### Error: "Network timeout" or "ECONNREFUSED"
- Check internet connection
- Verify cluster is running in MongoDB Atlas
- Check IP whitelist includes `0.0.0.0/0`

### Error: "MongoServerError: bad auth"
- Password might be incorrect
- Go to MongoDB Atlas → Database Access
- Reset password for `broosowwan_db_user`

## Verify in MongoDB Atlas

After successful test:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click "Browse Collections"
3. Select `sowwanpay` database
4. You should see a `tests` collection with your test document

## Next Steps

Once test passes:

1. ✅ MongoDB is working
2. Copy backend code from `BACKEND_CODE.md`
3. Create full backend server
4. Deploy to Render
5. Connect frontend

**Your MongoDB connection is ready!** 🚀
