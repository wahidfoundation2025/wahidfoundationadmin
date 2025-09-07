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

const ImpactCategoriesDocSchema = new mongoose.Schema({
  section: {
    title: String,
    subtitle: String,
  },
  categories: [CategorySchema],
});

export default mongoose.models.ImpactCategoriesDoc ||
  mongoose.model("ImpactCategoriesDoc", ImpactCategoriesDocSchema);
