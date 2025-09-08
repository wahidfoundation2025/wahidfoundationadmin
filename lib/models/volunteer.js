import mongoose from "mongoose";

const VolunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  skills: { type: String, required: true },
  availability: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastUpdatedBy: {
    type: String, // store user email, name, or id
    default: null,
  },
  history: [
    {
      name: String,
      email: String,
      phone: String,
      skills: String,
      availability: String,
      message: String,
      createdAt: Date,
      updatedBy: String,
      updatedAt: { type: Date, default: Date.now },
    },
  ],
});

VolunteerSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (!docToUpdate) return next();

    const updatedBy = this.getUpdate().lastUpdatedBy || "system";

    const historyItem = {
      name: docToUpdate.name,
      email: docToUpdate.email,
      phone: docToUpdate.phone,
      skills: docToUpdate.skills,
      availability: docToUpdate.availability,
      message: docToUpdate.message,
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

export default mongoose.models.Volunteer ||
  mongoose.model("Volunteer", VolunteerSchema);
