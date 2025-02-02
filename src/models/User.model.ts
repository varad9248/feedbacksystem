import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // If using email/password
    provider: { type: String, enum: ["google", "github", "email"], required: true },
    profilePicture: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    createdForms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Form" }],
    feedbackGiven: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feedback" }],
    points: { type: Number, default: 0 }, // Gamification
    badges: [{ type: String }], // Array of awarded badges
    createdAt: { type: Date, default: Date.now }
  });
  