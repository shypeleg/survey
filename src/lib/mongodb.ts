import mongoose from 'mongoose';

// Use the environment variable when available, otherwise use the hardcoded connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://shy:vHQBZ2vhJYD9ytXS@cluster0.qsywd.mongodb.net/survey-app?retryWrites=true&w=majority&appName=Cluster0';

console.log(`MongoDB: Using URI (first 20 chars): ${MONGODB_URI.substring(0, 20)}...`);

// Define interface for the cached connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare global mongoose variable for TypeScript
declare global {
  var mongoose: MongooseCache | undefined;
}

// Global variable to cache the connection
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

// Store in global for reuse across hot reloads in development
if (process.env.NODE_ENV !== 'production') {
  global.mongoose = cached;
}

async function dbConnect() {
  try {
    if (cached.conn) {
      console.log('MongoDB: Using cached connection');
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      };

      console.log('MongoDB: Creating new connection');
      mongoose.set('strictQuery', false);
      
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('MongoDB: Connected successfully');
        return mongoose;
      }).catch(err => {
        console.error('MongoDB: Connection error:', err);
        throw err;
      });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default dbConnect;