import mongoose from "mongoose";

const LeaderboardSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    totalFormsCreated: { type: Number, default: 0 },
    totalFeedbackGiven: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    rank: { type: Number }
  });
  