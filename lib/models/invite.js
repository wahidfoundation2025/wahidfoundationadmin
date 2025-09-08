// models/Invite.js
import mongoose from "mongoose";

const InviteSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    invitedBy: { type: String }, // Optional: who sent the invite (email or user ID)
    role: { type: String, default: "admin" }, // Default role for invited user
    access: [{ type: String }], // e.g., ['dashboard', 'cms']
    accepted: { type: Boolean, default: false }, // Whether invite is used
    createdAt: { type: Date, default: Date.now },
    lastUpdatedBy: {
      type: String, // store user email, name, or id
      default: null,
    },
    history: [
      {
        email: String,
        invitedBy: String,
        role: String,
        access: [String],
        accepted: Boolean,
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

InviteSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (!docToUpdate) return next();

    const updatedBy = this.getUpdate().lastUpdatedBy || "system";

    const historyItem = {
      email: docToUpdate.email,
      invitedBy: docToUpdate.invitedBy,
      role: docToUpdate.role,
      access: docToUpdate.access,
      accepted: docToUpdate.accepted,
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

const Invite = mongoose.models.Invite || mongoose.model("Invite", InviteSchema);

export default Invite;
