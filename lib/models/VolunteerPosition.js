import mongoose from "mongoose";

const VolunteerPositionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  commitment: { type: String, required: true },
  icon: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastUpdatedBy: {
    type: String, // store user email, name, or id
    default: null,
  },
  history: [
    {
      title: String,
      description: String,
      commitment: String,
      icon: String,
      createdAt: Date,
      updatedBy: String,
      updatedAt: { type: Date, default: Date.now },
    },
  ],
});

VolunteerPositionSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (!docToUpdate) return next();

    const updatedBy = this.getUpdate().lastUpdatedBy || "system";

    const historyItem = {
      title: docToUpdate.title,
      description: docToUpdate.description,
      commitment: docToUpdate.commitment,
      icon: docToUpdate.icon,
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

export default mongoose.models.VolunteerPosition ||
  mongoose.model("VolunteerPosition", VolunteerPositionSchema);
