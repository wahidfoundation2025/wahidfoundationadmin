import mongoose from "mongoose";

const AboutVisionSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, default: "Our Vision & Mission" },
    subtitle: {
      type: String,
      required: true,
      default: "Guiding principles that drive our impact",
    },
    vision: {
      type: String,
      required: true,
      default:
        "To create an equitable society where every individual, regardless of their socio-economic background, has access to education, healthcare, and opportunities for growth and self-sufficiency.",
    },
    mission: {
      type: String,
      required: true,
      default:
        "To mobilize microdonations starting from just ₹1 per day to fund sustainable development projects in education, healthcare, women empowerment, and economic growth across India, with full transparency and community involvement.",
    },
  },
  {
    timestamps: true,
  }
);

const AboutVisionSection =
  mongoose.models.AboutVisionSection ||
  mongoose.model("AboutVisionSection", AboutVisionSectionSchema);

export default AboutVisionSection;
