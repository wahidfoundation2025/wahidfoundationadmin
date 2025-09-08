import mongoose from "mongoose";

const ImpactStatsSchema = new mongoose.Schema(
  {
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

    lastUpdatedBy: {
      type: String,
      default: null,
    },
    history: [
      {
        title: String,
        subtitle: String,
        stats: [
          {
            icon: String,
            title: String,
            value: String,
            description: String,
            color: String,
          },
        ],
        updatedBy: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

ImpactStatsSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (!docToUpdate) return next();

    const updatedBy = this.getUpdate().lastUpdatedBy || "system";

    const historyItem = {
      title: docToUpdate.title,
      subtitle: docToUpdate.subtitle,
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

const ImpactStatContent =
  mongoose.models.ImpactStatContent ||
  mongoose.model("ImpactStatContent", ImpactStatsSchema);

export default ImpactStatContent;
