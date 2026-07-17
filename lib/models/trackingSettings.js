import mongoose from "mongoose";

const CustomScriptSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    enabled: { type: Boolean, default: true },
    // Where in the document to inject: head | body-start | body-end
    placement: {
      type: String,
      enum: ["head", "body-start", "body-end"],
      default: "head",
    },
    // external (load via src) | inline (raw JS)
    type: { type: String, enum: ["external", "inline"], default: "inline" },
    // afterInteractive | beforeInteractive | lazyOnload
    strategy: {
      type: String,
      enum: ["afterInteractive", "beforeInteractive", "lazyOnload"],
      default: "afterInteractive",
    },
    src: { type: String, default: "" }, // for external
    code: { type: String, default: "" }, // for inline
    // Page targeting: "all" pages, or only the paths listed in `pages`.
    pageScope: { type: String, enum: ["all", "specific"], default: "all" },
    pages: { type: [String], default: [] },
  },
  { _id: false }
);

const TrackingSettingsSchema = new mongoose.Schema(
  {
    // Singleton document.
    key: { type: String, default: "global", unique: true },
    ga4Id: { type: String, default: "" },
    gtmId: { type: String, default: "" },
    metaPixelId: { type: String, default: "" },
    customScripts: { type: [CustomScriptSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.TrackingSettings ||
  mongoose.model("TrackingSettings", TrackingSettingsSchema);
