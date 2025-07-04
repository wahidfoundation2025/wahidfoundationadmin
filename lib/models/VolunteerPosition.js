import mongoose from "mongoose";

const VolunteerPositionSchema = new mongoose.Schema({
  title: String,
  description: String,
  commitment: String,
  icon: String, // Store icon name or type
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.VolunteerPosition || mongoose.model("VolunteerPosition", VolunteerPositionSchema);