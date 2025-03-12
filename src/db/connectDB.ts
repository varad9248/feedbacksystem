import mongoose from "mongoose";

const MONGO_URI: string | undefined = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI is missing in environment variables.");
}

// Use a global variable to prevent multiple connections in serverless environments
interface GlobalWithMongoose {
  mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<typeof mongoose> | null;
  };
}

declare const global: GlobalWithMongoose;

global.mongoose = global.mongoose || { conn: null, promise: null };

const connectDB = async (): Promise<void> => {
  try {
    if (global.mongoose.conn) {
      console.log("✅ Already connected to MongoDB");
      return;
    }

    if (!global.mongoose.promise) {
      global.mongoose.promise = mongoose.connect(MONGO_URI, {
        dbName: "feedbacksys", // Optional: Set your database name
      });
    }

    global.mongoose.conn = await global.mongoose.promise;
    console.log("🚀 MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", (error as Error).message);
    process.exit(1); // Exit process on failure
  }
};

export default connectDB;
