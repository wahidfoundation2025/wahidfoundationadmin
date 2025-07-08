import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema({
  paymentId: { type: String, required: true },
  amount: { type: Number, required: true },
  donationType: { type: String, required: true },
  donationFrequency: { type: String, required: true }, // e.g. "One-Time" or "Monthly"
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: false },
  name: { type: String, required: true },
  email: { type: String, required: true },
  dedicatedTo: { type: String },
  message: { type: String },
  requestCertificate: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Donation || mongoose.model("Donation", DonationSchema);