import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.warn('⚠️  MONGODB_URI is not defined in environment variables');
      console.log('📝 Server will run without MongoDB. Character selections will use localStorage.');
      return null;
    }

    console.log('🔄 Connecting to MongoDB...');
    
    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('📝 Server will continue without MongoDB. Character selections will use localStorage.');
    console.log('\n🔧 To fix MongoDB:');
    console.log('   1. Create database user in MongoDB Atlas');
    console.log('   2. Add your IP to Network Access (0.0.0.0/0)');
    console.log('   3. Wait 2-3 minutes and restart server\n');
    return null;
  }
};

export default connectDB;