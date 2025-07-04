import mongoose from "mongoose";

const VolunteerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  skills: String,
  availability: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Volunteer || mongoose.model("Volunteer", VolunteerSchema);