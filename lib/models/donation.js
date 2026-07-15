import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema({
  paymentId: { type: String, required: true },
  amount: { type: Number, required: true },
  donationType: { type: String, required: true },
  donationFrequency: { type: String, required: true }, // e.g. "One-Time", "Weekly", "Monthly", "Yearly"
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: false },
  // Razorpay subscription id for recurring (autopay) donations; absent for one-time.
  subscriptionId: { type: String, index: true },
  subscriptionStatus: { type: String }, // active | cancelled | completed etc.
  name: { type: String, required: true },
  email: { type: String, required: true },
  dedicatedTo: { type: String },
  message: { type: String },
  requestCertificate: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Donation || mongoose.model("Donation", DonationSchema);