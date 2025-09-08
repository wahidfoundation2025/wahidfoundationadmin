// lib/models/Category.js
import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    lastUpdatedBy: { type: String, default: null },
    history: [{
      name: String,
      description: String,
      updatedBy: String,
      updatedAt: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

CategorySchema.pre("findOneAndUpdate", async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (!docToUpdate) return next();

    const updatedBy = this.getUpdate().lastUpdatedBy || "system";

    const historyItem = {
      name: docToUpdate.name,
      description: docToUpdate.description,
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

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
