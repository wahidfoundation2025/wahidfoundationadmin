// lib/models/Project.js
import mongoose from "mongoose";

const ImpactSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Direct", "Indirect", "Long-term"],
    required: true,
  },
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
    lastUpdatedBy: { type: String, default: null },
    history: [
      {
        title: String,
        description: String,
        category: [String],
        location: String,
        totalRequired: Number,
        collected: Number,
        beneficiaries: Number,
        completion: Number,
        daysLeft: Number,
        status: String,
        mainImage: String,
        cardImage: String,
        photoGallery: [String],
        youtubeIframe: String,
        overview: String,
        projectManager: ProjectManagerSchema,
        og: OgSchema,
        impact: [ImpactSchema],
        timeline: [TimelineSchema],
        scheme: [SchemeSchema],
        updates: [UpdateSchema],
        donationOptions: [DonationOptionSchema],
        slug: String,
        target_keywords: [String],
        metatitle: String,
        metadescription: String,
        minDonationAmount: Number,
        donationFrequency: String,
        createdAt: Date,
        updatedBy: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

ProjectSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (!docToUpdate) return next();

    const updatedBy = this.getUpdate().lastUpdatedBy || "system";

    const historyItem = {
      title: docToUpdate.title,
      description: docToUpdate.description,
      category: docToUpdate.category,
      location: docToUpdate.location,
      totalRequired: docToUpdate.totalRequired,
      collected: docToUpdate.collected,
      beneficiaries: docToUpdate.beneficiaries,
      completion: docToUpdate.completion,
      daysLeft: docToUpdate.daysLeft,
      status: docToUpdate.status,
      mainImage: docToUpdate.mainImage,
      cardImage: docToUpdate.cardImage,
      photoGallery: docToUpdate.photoGallery,
      youtubeIframe: docToUpdate.youtubeIframe,
      overview: docToUpdate.overview,
      projectManager: docToUpdate.projectManager,
      og: docToUpdate.og,
      impact: docToUpdate.impact,
      timeline: docToUpdate.timeline,
      scheme: docToUpdate.scheme,
      updates: docToUpdate.updates,
      donationOptions: docToUpdate.donationOptions,
      slug: docToUpdate.slug,
      target_keywords: docToUpdate.target_keywords,
      metatitle: docToUpdate.metatitle,
      metadescription: docToUpdate.metadescription,
      minDonationAmount: docToUpdate.minDonationAmount,
      donationFrequency: docToUpdate.donationFrequency,
      createdAt: docToUpdate.createdAt,
      updatedBy,
      updatedAt: new Date(),
    };

    // Push into history
    await this.findOneAndUpdate({}, { $push: { history: historyItem } });

    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
