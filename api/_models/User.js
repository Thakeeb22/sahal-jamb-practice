import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    unique: true, // prevent duplicate fullnames
  },
  password: {
    type: String,
    required: true,
  },
  licenseCode: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model overwrite in serverless
export default mongoose.models.User || mongoose.model("User", UserSchema);
