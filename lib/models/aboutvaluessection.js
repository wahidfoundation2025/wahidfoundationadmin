import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
  icon: { type: String },
  title: { type: String },
  description: { type: String },
});

const AboutValuesSectionSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    cards: [CardSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.AboutValuesSection ||
  mongoose.model("AboutValuesSection", AboutValuesSectionSchema);
