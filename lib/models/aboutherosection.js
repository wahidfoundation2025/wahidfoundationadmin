import mongoose from "mongoose";

const AboutHeroSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "About Wahid Foundation",
    },
    subtitle: {
      type: String,
      required: true,
      default: "Empowering Communities, One Rupee at a Time.",
    },
    ctaText: {
      type: String,
      required: true,
      default: "Join our mission",
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
    finalCTATitle: {
      type: String,
      required: true,
      default: "Join Our Mission",
    },
    finalCTASubtitle: {
      type: String,
      required: true,
      default:
        "Be part of a movement that's transforming lives across India. Start with just ₹1 per day.",
    },
    secondaryCTA: {
      text: { type: String, default: "Start Giving Now ->" },
      link: { type: String, default: "/projects" },
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
          yearsOfImpact: {
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
        finalCTATitle: String,
        finalCTASubtitle: String,
        secondaryCTA: String,
        vision: String,
        mission: String,
        updatedBy: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

AboutHeroSectionSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (!docToUpdate) return next();

    const updatedBy = this.getUpdate().lastUpdatedBy || "system";

    const historyItem = {
      title: docToUpdate.title,
      subtitle: docToUpdate.subtitle,
      ctaText: docToUpdate.ctaText,
      stats: docToUpdate.stats,
      finalCTATitle: docToUpdate.finalCTATitle,
      finalCTASubtitle: docToUpdate.finalCTASubtitle,
      secondaryCTA: docToUpdate.secondaryCTA,
      vision: docToUpdate.vision,
      mission: docToUpdate.mission,
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

const AboutHeroSection =
  mongoose.models.AboutHeroSection ||
  mongoose.model("AboutHeroSection", AboutHeroSectionSchema);

export default AboutHeroSection;
