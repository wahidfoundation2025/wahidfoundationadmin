// lib/models/Project.js
import mongoose from "mongoose";

const ImpactSchema = new mongoose.Schema({
  type: { type: String, enum: ["Direct", "Indirect", "Long-term"], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String },
});

const UpdateSchema = new mongoose.Schema({
  version: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

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
    photoGallery: [{ type: String }],
    youtubeIframe: { type: String },
    overview: { type: String },
    projectManager: ProjectManagerSchema,
    updates: [UpdateSchema],
    impact: [ImpactSchema],
    donationOptions: [DonationOptionSchema],
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
