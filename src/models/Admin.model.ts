import mongoose, { mongo } from "mongoose";

const AdminSettingsSchema = new mongoose.Schema({
    moderatedForms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Form" }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reportLogs: [
      {
        reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reportedForm: { type: mongoose.Schema.Types.ObjectId, ref: "Form" },
        reason: { type: String },
        status: { type: String, enum: ["pending", "reviewed", "resolved"], default: "pending" },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  });

  export default mongoose.models.Admin || mongoose.model("Admin" , AdminSettingsSchema);
  