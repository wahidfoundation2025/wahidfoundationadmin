// models/Blog.js
import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  // Main blog content
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // SEO-friendly URL slug

  // Featured image
  imageUrl: { type: String }, // Cloudinary URL
  imageAlt: { type: String }, // Featured image alt text for accessibility & SEO

  // Author
  authorName: { type: String, required: true },

  // Category tags
  categories: [{ type: String }], // Array of category names

  // Content
  content: { type: String, required: true }, // Rich text HTML

  // YouTube video (optional)
  youtubeUrl: { type: String },

  // SEO fields
  metaTitle: { type: String },
  metaDescription: { type: String },
  targetKeywords: [{ type: String }], // Array of keywords

  // Open Graph (OG) fields
  ogTitle: { type: String },
  ogDescription: { type: String },
  ogImage: { type: String }, // Could default to featured image

  // Schema markup (JSON-LD)
  schemaMarkup: { type: Object }, // Store JSON directly

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
