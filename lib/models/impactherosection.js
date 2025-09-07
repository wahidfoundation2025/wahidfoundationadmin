// lib/models/ImpactHeroSection.js

import mongoose from "mongoose";

const ImpactHeroSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "Our Impact"
  },
  subtitle: {
    type: String,
    required: true,
    default: "Transforming Lives Across India Through Collective Action"
  },
  ctaText: {
    type: String,
    required: true,
    default: "Start Making Impact"
  },
  stats: {
    projects: {
      label: { type: String, default: "Projects" },
      value: { type: String, default: "112" }
    },
    livesChanged: {
      label: { type: String, default: "Lives Changed" },
      value: { type: String, default: "25K+" }
    },
    states: {
      label: { type: String, default: "States" },
      value: { type: String, default: "14" }
    }
  },
});

const ImpactHeroSection =
  mongoose.models.ImpactHeroSection ||
  mongoose.model("ImpactHeroSection", ImpactHeroSectionSchema);

export default ImpactHeroSection;
