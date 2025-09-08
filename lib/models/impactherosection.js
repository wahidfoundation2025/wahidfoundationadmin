// lib/models/ImpactHeroSection.js

import mongoose from "mongoose";

const ImpactHeroSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Our Impact",
    },
    subtitle: {
      type: String,
      required: true,
      default: "Transforming Lives Across India Through Collective Action",
    },
    ctaText: {
      type: String,
      required: true,
      default: "Start Making Impact",
    },
    stats: {
      projects: {
        label: { type: String, default: "Projects" },
        value: { type: String, default: "112" },
      },
      livesChanged: {
        label: { type: String, default: "Lives Changed" },
        value: { type: String, default: "25K+" },
      },
      states: {
        label: { type: String, default: "States" },
        value: { type: String, default: "14" },
      },
    },
    lastUpdatedBy: {
      type: String, // store user email, name, or id
      default: null,
    },
    history: [
      {
        title: String,
        subtitle: String,
        ctaText: String,
        stats: {
          projects: {
            label: String,
            value: String,
          },
          livesChanged: {
            label: String,
            value: String,
          },
          states: {
            label: String,
            value: String,
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

ImpactHeroSectionSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (!docToUpdate) return next();

    const updatedBy = this.getUpdate().lastUpdatedBy || "system";

    const historyItem = {
      title: docToUpdate.title,
      subtitle: docToUpdate.subtitle,
      ctaText: docToUpdate.ctaText,
      stats: docToUpdate.stats,
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

const ImpactHeroSection =
  mongoose.models.ImpactHeroSection ||
  mongoose.model("ImpactHeroSection", ImpactHeroSectionSchema);

export default ImpactHeroSection;
