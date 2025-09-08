import mongoose from "mongoose";

const StatSchema = new mongoose.Schema({
  label: String,
  value: String,
  progress: Number,
});

const CategorySchema = new mongoose.Schema({
  key: String,
  title: String,
  subtitle: String,
  color: String,
  description: String,
  link: String,
  stats: [StatSchema],
});

const ImpactCategoriesDocSchema = new mongoose.Schema(
  {
    section: {
      title: String,
      subtitle: String,
    },
    categories: [CategorySchema],
    lastUpdatedBy: {
      type: String, // email, name, or userId
      default: null,
    },
    history: [
      {
        section: {
          title: String,
          subtitle: String,
        },
        categories: [CategorySchema],
        updatedBy: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

ImpactCategoriesDocSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (!docToUpdate) return next();

    const updatedBy = this.getUpdate().lastUpdatedBy || "system";

    const historyItem = {
      section: docToUpdate.section,
      categories: docToUpdate.categories,
      updatedBy,
      updatedAt: new Date(),
    };

    await this.findOneAndUpdate({}, { $push: { history: historyItem } });

    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.models.ImpactCategoriesDoc ||
  mongoose.model("ImpactCategoriesDoc", ImpactCategoriesDocSchema);
