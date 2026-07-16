import mongoose from "mongoose";

const InfluencerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // Unique referral code used in the ?ref= link (e.g. aisha-9fx2).
    code: { type: String, required: true, unique: true, index: true },
    email: { type: String },
    phone: { type: String },
    notes: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Influencer ||
  mongoose.model("Influencer", InfluencerSchema);
