// lib/models/Project.js
import mongoose from "mongoose";

const ImpactSchema = new mongoose.Schema({
  type: { type: String, enum: ["Direct", "Indirect", "Long-term"], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const UpdateSchema = new mongoose.Schema({
  version: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const TimelineSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, required: true },
})

const DonationOptionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["General Donation", "Zakat", "Sadqa", "Interest Earnings"],
    required: true,
  },
  isEnabled: { type: Boolean, default: true },
});

const ProjectManagerSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String },
});

const SchemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  link: { type: String },
});

const OgSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  image: { type: String },
  url: { type: String },
});

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: [{ type: String }],
    location: { type: String },
    totalRequired: { type: Number },
    collected: { type: Number },
    beneficiaries: { type: Number },
    completion: { type: Number },
    daysLeft: { type: Number },
    status: {
      type: String,
      enum: ["Active", "Completed", "Upcoming", "Draft"],
      default: "Active",
    },
    mainImage: { type: String },
    cardImage: { type: String },
    photoGallery: [{ type: String }],
    youtubeIframe: { type: String },
    overview: { type: String },
    projectManager: ProjectManagerSchema,
    og: OgSchema, // One single OG object
    impact: [ImpactSchema], // Already array
    timeline: [TimelineSchema], // Array of timeline events
    scheme: [SchemeSchema], // Array of schemes
    updates: [UpdateSchema], // Array of updates
    donationOptions: [DonationOptionSchema],
    slug: { type: String, unique: true },
    target_keywords: [{ type: String }],
    metatitle: { type: String },
    metadescription: { type: String },
    minDonationAmount: { type: Number, default: 365 },
    donationFrequency: {
      type: String,
      enum: ["One Time", "Monthly", "Yearly"],
      default: "One Time",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
