import mongoose from "mongoose";

const LicenseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  schoolName: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Prevent model overwrite in serverless
export default mongoose.models.License ||
  mongoose.model("License", LicenseSchema);
