import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
    formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Anonymous feedback possible
    responses: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId },
        responseType: { type: String, enum: ["mcq", "truefalse", "descriptive", "star"], required: true },
        answer: String, // For descriptive & true/false
        selectedOption: String, // For MCQs
        rating: { type: Number, default: 0 } // For star rating
      }
    ],
    createdAt: { type: Date, default: Date.now }
  });
  