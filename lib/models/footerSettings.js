// lib/models/footerSettings.js
import mongoose from "mongoose";

const FooterSettingsSchema = new mongoose.Schema(
  {
    orgName: String,

    quickLinks: [
      {
        label: String,
        path: String,
      },
    ],
    termsLinks: [
      {
        label: String,
        path: String,
      },
    ],
    volunteering: {
      heading: String,
      description: String,
      linkLabel: String,
      linkPath: String,
    },
    socialLinks: {
      facebook: String,
      instagram: String,
      linkedin: String,
      twitter: String,
    },
    copyrightText: {
      type: String,
      default: `All rights reserved - © ${new Date().getFullYear()}`,
    },
    lastUpdatedBy: {
      type: String, // store user email, name, or id
      default: null,
    },
    history: [
      {
        orgName: String,
        quickLinks: [
          {
            label: String,
            path: String,
          },
        ],
        termsLinks: [
          {
            label: String,
            path: String,
          },
        ],
        volunteering: {
          heading: String,
          description: String,
          linkLabel: String,
          linkPath: String,
        },
        socialLinks: {
          facebook: String,
          instagram: String,
          linkedin: String,
          twitter: String,
        },
        copyrightText: String,
        updatedBy: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

FooterSettingsSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (!docToUpdate) return next();

    const updatedBy = this.getUpdate().lastUpdatedBy || "system";

    const historyItem = {
      orgName: docToUpdate.orgName,
      quickLinks: docToUpdate.quickLinks,
      termsLinks: docToUpdate.termsLinks,
      volunteering: docToUpdate.volunteering,
      socialLinks: docToUpdate.socialLinks,
      copyrightText: docToUpdate.copyrightText,
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

export default mongoose.models.FooterSettings ||
  mongoose.model("FooterSettings", FooterSettingsSchema);
