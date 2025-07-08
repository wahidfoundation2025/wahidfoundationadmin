// lib/models/HomeHeroSection.js

import mongoose from "mongoose";

const HomeHeroSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "Transform Lives with Just ₹1/day"
  },
  subtitle: {
    type: String,
    required: true,
    default: "Join 10,000+ donors making a real difference across India. Start your impact journey today."
  },
  ctaText: {
    type: String,
    required: true,
    default: "Start Giving Now"
  },
  stats: {
    perDay: {
      label: { type: String, default: "Per Day" },
      value: { type: String, default: "₹1" }
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
  cards: [
    {
      icon: { type: String }, // e.g., 'Calendar', 'Users', 'Heart'
      title: { type: String },
      description: { type: String },
      themeColor: { type: String, default: "emerald" } // for conditional styling
    }
  ],
  secondaryCTA: {
    text: { type: String, default: "See Our Projects" },
    link: { type: String, default: "/projects" }
  }
});

const HomeHeroSection =
  mongoose.models.HomeHeroSection ||
  mongoose.model("HomeHeroSection", HomeHeroSectionSchema);

export default HomeHeroSection;
