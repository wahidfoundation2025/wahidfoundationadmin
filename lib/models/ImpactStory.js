import mongoose from "mongoose";

const ImpactStorySchema = new mongoose.Schema({
  quote: { type: String, required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  initials: { type: String, required: true },
  icon: { type: String, required: true }, // e.g. "GraduationCap", "Heart"
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.ImpactStory || mongoose.model("ImpactStory", ImpactStorySchema);