// models/Blog.js
import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: String,
  content: String,  // this will store HTML from the editor
  imageUrl: String, // Cloudinary URL
  youtubeUrl: String, // YouTube link
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
