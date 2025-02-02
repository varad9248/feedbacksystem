import mongoose from "mongoose";

const MONGO_URI : string = process.env.MONGO_URI || ''; // Ensure you set this in .env file

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("✅ Already connected to MongoDB");
      return;
    }
    await mongoose.connect(MONGO_URI);
    console.log("🚀 MongoDB connected successfully");
  } catch (error : any) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Exit process on failure
  }
};

export default connectDB;
