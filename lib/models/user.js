import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  role: { type: String, required: true, default: "admin" }, // e.g., admin, finance, editor
  access: [{ type: String }], // e.g., ["dashboard", "donation", "donors", "cms", "settings"]
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
