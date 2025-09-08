import mongoose from "mongoose";

const DonorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePicture: { type: String }, // URL to profile picture
    pancardNumber: { type: String, unique: true }, // Unique PAN card number for tax purposes
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zipCode: { type: String },
    },
    phoneNumber: { type: String }, // Contact number
    donations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Donation" }], // Array of linked donations
    totalProjects: { type: Number, default: 0 },
    totalDonated: { type: Number, default: 0 },
    projectsDonatedTo: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    ],
    taxReceipts: [
      {
        receiptUrl: { type: String }, // URL to the tax receipt PDF/image
        issuedAt: { type: Date, default: Date.now },
      },
    ],
    createdAt: { type: Date, default: Date.now },
    lastUpdatedBy: {
      type: String, // store user email, name, or id
      default: null,
    },
    history: [
      {
        name: String,
        email: String,
        profilePicture: String,
        pancardNumber: String,
        address: {
          street: String,
          city: String,
          state: String,
          country: String,
          zipCode: String,
        },
        phoneNumber: String,
        donations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Donation" }],
        totalProjects: Number,
        totalDonated: Number,
        projectsDonatedTo: [
          { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
        ],
        taxReceipts: [
          {
            receiptUrl: String,
            issuedAt: Date,
          },
        ],
        createdAt: Date,
        updatedBy: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

DonorSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (!docToUpdate) return next();

    const updatedBy = this.getUpdate().lastUpdatedBy || "system";

    const historyItem = {
      name: docToUpdate.name,
      email: docToUpdate.email,
      profilePicture: docToUpdate.profilePicture,
      pancardNumber: docToUpdate.pancardNumber,
      address: docToUpdate.address,
      phoneNumber: docToUpdate.phoneNumber,
      donations: docToUpdate.donations,
      totalProjects: docToUpdate.totalProjects,
      totalDonated: docToUpdate.totalDonated,
      projectsDonatedTo: docToUpdate.projectsDonatedTo,
      taxReceipts: docToUpdate.taxReceipts,
      createdAt: docToUpdate.createdAt,
      updatedBy,
      updatedAt: new Date(),
    };

    // Append to history without overwriting existing entries
    await this.findOneAndUpdate({}, { $push: { history: historyItem } });

    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.models.Donor || mongoose.model("Donor", DonorSchema);
