import mongoose from "mongoose";

const DonorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String }, // URL to profile picture
  donations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Donation" }], // Array of linked donations
  totalProjects: { type: Number, default: 0 },
  totalDonated: { type: Number, default: 0 },
  projectsDonatedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  taxReceipts: [
    {
      receiptUrl: { type: String }, // URL to the tax receipt PDF/image
      issuedAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Donor || mongoose.model("Donor", DonorSchema);