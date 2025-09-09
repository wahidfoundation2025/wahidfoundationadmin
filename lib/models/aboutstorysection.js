import mongoose from "mongoose";

const AboputStorySectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, default: "Our Story" },
    subtitle: {
      type: String,
      required: true,
      default: "How we started and where we're headed",
    },
    journey: [
      {
        title: { type: String, required: true },
        content: {
          type: String,
          required: true,
        },
      },
    ],
    impact: [
      {
        title: { type: String, required: true },
        content: {
          type: String,
          required: true,
        },
      },
    ],

    future: [
      {
        title: { type: String, required: true },
        content: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const AboutStorySection =
  mongoose.models.AboutStorySection ||
  mongoose.model("AboutStorySection", AboputStorySectionSchema);

export default AboutStorySection;
