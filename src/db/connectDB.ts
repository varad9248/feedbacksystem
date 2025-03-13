import mongoose from "mongoose";
import { Mongoose } from "mongoose";

const MONGO_URI: string | undefined = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI is missing in environment variables.");
}

interface MongooseConn {
  conn : Mongoose | null,
  promise : Promise<Mongoose> | null
}

let cached : MongooseConn = (global as any).mongoose;

if(!cached){
  cached = (global as any).mongoose = {
    conn : null,
    promise : null
  }
}

export const connectDB = async() => {
  if(cached.conn) return cached.conn;

  cached.promise = cached.promise || mongoose.connect(MONGO_URI ,{
    dbName : "feedbacksys",
    bufferCommands : false,
    connectTimeoutMS : 30000,
  });

  cached.conn = await cached.promise;

  return cached.conn;
}