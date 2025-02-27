import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://shy:vHQBZ2vhJYD9ytXS@cluster0.qsywd.mongodb.net/survey-app?retryWrites=true&w=majority&appName=Cluster0';

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
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    mongoose.set('strictQuery', false);
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;