import mongoose from "mongoose";

const OgSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  url: { type: String },
});

const HomeHeroSectionSchema = new mongoose.Schema(
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
      perDay: {
        label: { type: String, default: "Per Day" },
        value: { type: String, default: "₹1" },
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
    cards: [
      {
        icon: { type: String },
        title: { type: String },
        description: { type: String },
        themeColor: { type: String, default: "emerald" },
      },
    ],
    secondaryCTA: {
      text: { type: String, default: "See Our Projects" },
      link: { type: String, default: "/projects" },
    },
    target_keywords: [{ type: String }],
    metatitle: { type: String },
    metadescription: { type: String },
    og: OgSchema,
    schemaMarkup: { type: Object, default: {} },
    lastUpdatedBy: {
      type: String, // store user email, name, or id
      default: null,
    },
    history: [
      {
        title: String,
        subtitle: String,
        ctaText: String,
        stats: Object,
        cards: Array,
        secondaryCTA: Object,
        target_keywords: Array,
        metatitle: String,
        metadescription: String,
        schemaMarkup: Object,
        updatedBy: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// Middleware to keep version history using $push
HomeHeroSectionSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (!docToUpdate) return next();

    const updatedBy = this.getUpdate().lastUpdatedBy || "system";

    const historyItem = {
      title: docToUpdate.title,
      subtitle: docToUpdate.subtitle,
      ctaText: docToUpdate.ctaText,
      stats: docToUpdate.stats,
      cards: docToUpdate.cards,
      secondaryCTA: docToUpdate.secondaryCTA,
      target_keywords: docToUpdate.target_keywords,
      metatitle: docToUpdate.metatitle,
      metadescription: docToUpdate.metadescription,
      schemaMarkup: docToUpdate.schemaMarkup,
      updatedBy,
      updatedAt: new Date(),
    };

    // Append to history without overwriting existing entries
    this.findOneAndUpdate({}, { $push: { history: historyItem } });

    next();
  } catch (err) {
    next(err);
  }
});

const HomeHeroSection =
  mongoose.models.HomeHeroSection ||
  mongoose.model("HomeHeroSection", HomeHeroSectionSchema);

export default HomeHeroSection;
