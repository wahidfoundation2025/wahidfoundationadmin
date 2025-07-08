import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
    required: false,
  },
  theme: {
    type: String,
    required: false,
    default: "inspiration", // optional categorization
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Quote || mongoose.model("Quote", quoteSchema);
