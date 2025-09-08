// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  role: { type: String, required: true, default: "admin" }, // can be any string
  access: [{ type: String }], // e.g., ['dashboard', 'cms']
  createdAt: { type: Date, default: Date.now },
  lastUpdatedBy: {
    type: String, // store user email, name, or id
    default: null,
  },
  history: [
    {
      email: String,
      name: String,
      role: String,
      access: [String],
      createdAt: Date,
      updatedBy: String,
      updatedAt: { type: Date, default: Date.now },
    },
  ],
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (!docToUpdate) return next();

    const updatedBy = this.getUpdate().lastUpdatedBy || "system";

    const historyItem = {
      email: docToUpdate.email,
      name: docToUpdate.name,
      role: docToUpdate.role,
      access: docToUpdate.access,
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

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
