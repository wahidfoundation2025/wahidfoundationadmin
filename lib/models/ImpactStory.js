import mongoose from "mongoose";

const ImpactStorySchema = new mongoose.Schema(
  {
    quote: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    initials: { type: String, required: true },
    icon: { type: String, required: true }, // e.g. "GraduationCap", "Heart"
    createdAt: { type: Date, default: Date.now },
    lastUpdatedBy: {
      type: String, // store user email, name, or id
      default: null,
    },
    history: [
      {
        quote: String,
        name: String,
        location: String,
        initials: String,
        icon: String,
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

ImpactStorySchema.pre("findOneAndUpdate", async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (!docToUpdate) return next();

    const updatedBy = this.getUpdate().lastUpdatedBy || "system";

    const historyItem = {
      quote: docToUpdate.quote,
      name: docToUpdate.name,
      location: docToUpdate.location,
      initials: docToUpdate.initials,
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

export default mongoose.models.ImpactStory ||
  mongoose.model("ImpactStory", ImpactStorySchema);
