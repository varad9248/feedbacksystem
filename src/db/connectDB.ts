import mongoose from "mongoose";

const MONGO_URI: string | undefined = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI is missing in environment variables.");
}

// Fix global type
interface GlobalWithMongoose {
  mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

declare global {
  var mongoose: GlobalWithMongoose["mongoose"];
}

global.mongoose = global.mongoose || { conn: null, promise: null };

const connectDB = async (): Promise<void> => {
  try {
    if (global.mongoose.conn) {
      console.log("✅ Already connected to MongoDB");
      return;
    }

    if (!global.mongoose.promise) {
      global.mongoose.promise = mongoose.connect(MONGO_URI, {
        dbName: "feedbacksys", // Set your database name
      }).then((m) => m.connection); // Fix: Extract connection
    }

    global.mongoose.conn = await global.mongoose.promise;
    console.log("🚀 MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", (error as Error).message);
    process.exit(1); // Exit process on failure
  }
};

export default connectDB;
