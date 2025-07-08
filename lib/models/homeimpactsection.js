import mongoose from "mongoose";

const ImpactStatsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "Our Impact So Far",
  },
  subtitle: {
    type: String,
    required: true,
    default: "See how your contributions make a difference",
  },
  stats: [
    {
      icon: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
    },
  ],
});

const ImpactStatContent =
  mongoose.models.ImpactStatContent ||
  mongoose.model("ImpactStatContent", ImpactStatsSchema);

export default ImpactStatContent;
