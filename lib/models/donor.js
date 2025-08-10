import mongoose from "mongoose";


const DonorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String }, // URL to profile picture
  pancardNumber: { type: String, unique: true }, // Unique PAN card number for tax purposes
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zipCode: { type: String }
  },
  phoneNumber: { type: String }, // Contact number
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