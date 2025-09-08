import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      required: false,
    },
    theme: {
      type: String,
      required: false,
      default: "inspiration", // optional categorization
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastUpdatedBy: {
      type: String, // store user email, name, or id
      default: null,
    },
    history: [
      {
        text: String,
        reference: String,
        theme: String,
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

quoteSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (!docToUpdate) return next();

    const updatedBy = this.getUpdate().lastUpdatedBy || "system";

    const historyItem = {
      text: docToUpdate.text,
      reference: docToUpdate.reference,
      theme: docToUpdate.theme,
      createdAt: docToUpdate.theme,
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

export default mongoose.models.Quote || mongoose.model("Quote", quoteSchema);
