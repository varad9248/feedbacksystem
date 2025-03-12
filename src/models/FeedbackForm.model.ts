import mongoose from "mongoose";

const FormSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: [
      {
        type: { type: String, enum: ["mcq", "truefalse", "descriptive", "star"], required: true },
        question: { type: String, required: true },
        options: [String], // Only for MCQs
        maxStars: { type: Number, default: 5 }, // For star ratings
      }
    ],
    isPublic: { type: Boolean, default: false }, // Public or private form
    totalResponses: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  });

  export const FeedbackForm = mongoose.models.FeedbackForm || mongoose.model("FeedbackForm", FormSchema);
  