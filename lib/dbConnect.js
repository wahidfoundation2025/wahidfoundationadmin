import mongoose from "mongoose";

let cached = global.mongoose || { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      dbName: "your_db_name", // Replace with your DB name or remove if in URI
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  global.mongoose = cached; // Ensure cache persists in dev
  return cached.conn;
}