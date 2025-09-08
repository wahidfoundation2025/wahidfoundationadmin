// models/Blog.js
import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
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

    lastUpdatedBy: {
      type: String, // store user email, name, or id
      default: null,
    },
    history: [
      {
        title: String,
        slug: String,
        imageUrl: String,
        imageAlt: String,
        authorName: String,
        categories: [String],
        content: String,
        youtubeUrl: String,
        metaTitle: String,
        metaDescription: String,
        targetKeywords: [String],
        ogTitle: String,
        ogDescription: String,
        ogImage: String,
        schemaMarkup: Object,
        createdAt: Date,
        updatedBy: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

BlogSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (!docToUpdate) return next();

    const updatedBy = this.getUpdate().lastUpdatedBy || "system";

    const historyItem = {
      title: docToUpdate.title,
      slug: docToUpdate.slug,
      imageUrl: docToUpdate.imageUrl,
      imageAlt: docToUpdate.imageAlt,
      authorName: docToUpdate.authorName,
      categories: docToUpdate.categories,
      content: docToUpdate.content,
      youtubeUrl: docToUpdate.youtubeUrl,
      metaTitle: docToUpdate.metaTitle,
      metaDescription: docToUpdate.metaDescription,
      targetKeywords: docToUpdate.targetKeywords,
      ogTitle: docToUpdate.ogTitle,
      ogDescription: docToUpdate.ogDescription,
      ogImage: docToUpdate.ogImage,
      schemaMarkup: docToUpdate.schemaMarkup,
      createdAt: docToUpdate.createdAt,
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

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
