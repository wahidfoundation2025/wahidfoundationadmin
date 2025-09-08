import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema(
  {
    paymentId: { type: String, required: true },
    amount: { type: Number, required: true },
    donationType: { type: String, required: true },
    donationFrequency: { type: String, required: true }, // e.g. "One-Time" or "Monthly"
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: false,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    dedicatedTo: { type: String },
    message: { type: String },
    requestCertificate: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    lastUpdatedBy: {
      type: String, // store user email, name, or id
      default: null,
    },
    history: [
      {
        paymentId: String,
        amount: Number,
        donationType: String,
        donationFrequency: String,
        projectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Project",
        },
        name: String,
        email: String,
        dedicatedTo: String,
        message: String,
        requestCertificate: Boolean,
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

DonationSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (!docToUpdate) return next();

    const updatedBy = this.getUpdate().lastUpdatedBy || "system";

    const historyItem = {
      paymentId: docToUpdate.paymentId,
      amount: docToUpdate.amount,
      donationType: docToUpdate.donationType,
      donationFrequency: docToUpdate.donationFrequency,
      projectId: docToUpdate.projectId,
      name: docToUpdate.name,
      email: docToUpdate.email,
      dedicatedTo: docToUpdate.dedicatedTo,
      message: docToUpdate.message,
      requestCertificate: docToUpdate.requestCertificate,
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

export default mongoose.models.Donation ||
  mongoose.model("Donation", DonationSchema);
