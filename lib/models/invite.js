// models/Invite.js
import mongoose from "mongoose";

const InviteSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  invitedBy: { type: String }, // Optional: who sent the invite (email or user ID)
  role: { type: String, default: "admin" }, // Default role for invited user
  access: [{ type: String }], // e.g., ['dashboard', 'cms']
  accepted: { type: Boolean, default: false }, // Whether invite is used
  createdAt: { type: Date, default: Date.now },
});

const Invite = mongoose.models.Invite || mongoose.model("Invite", InviteSchema);

export default Invite;
