import mongoose from "mongoose";

const OgSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  url: { type: String },
});

const AboutHeroSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Transform Lives with Just ₹1/day",
    },
    subtitle: {
      type: String,
      required: true,
      default:
        "Join 10,000+ donors making a real difference across India. Start your impact journey today.",
    },
    ctaText: {
      type: String,
      required: true,
      default: "Start Giving Now",
    },
    stats: {
      yearsOfImpact: {
        label: { type: String, default: "Years of Impact" },
        value: { type: String, default: "5+" },
      },
      livesChanged: {
        label: { type: String, default: "Lives Changed" },
        value: { type: String, default: "25K+" },
      },
      states: {
        label: { type: String, default: "States Reached" },
        value: { type: String, default: "14" },
      },
    },
    secondaryCTATitle: { type: String, default: "Join Our Mission" },
    secondaryCTASubtitle: {
      type: String,
      default:
        "Be part of a movement that's transforming lives across India. Start with just ₹1 per day.",
    },
    secondaryCTA: {
      text: { type: String, default: "See Our Projects" },
      link: { type: String, default: "/projects" },
    },
    target_keywords: [{ type: String }],
    metatitle: { type: String },
    metadescription: { type: String },
    og: OgSchema,
    schemaMarkup: { type: Object, default: {} },
  },
  {
    timestamps: true,
  }
);

const AboutHeroSection =
  mongoose.models.AboutHeroSection ||
  mongoose.model("AboutHeroSection", AboutHeroSectionSchema);

export default AboutHeroSection;
