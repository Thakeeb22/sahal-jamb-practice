import connectDB from "../_utils/db.js";
import User from "../_models/User.js";
import License from "../_models/License.js";
import { hashPassword } from "../_utils/hash.js";
import { signToken } from "../_utils/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    // Drop unique index on licenseCode if it exists to allow reuse
    try {
      await User.collection.dropIndex("licenseCode_1");
    } catch (err) {
      // Index might not exist, ignore error
    }

    const { fullname, password, licenseCode } = req.body;

    // Validate input
    if (!fullname || !password || !licenseCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check license code
    const license = await License.findOne({
      code: licenseCode,
      isActive: true,
    });
    if (!license) {
      return res.status(400).json({ message: "Invalid license code" });
    }

    // Check if fullname already exists
    const existingUser = await User.findOne({ fullname });
    if (existingUser) {
      return res.status(400).json({ message: "Fullname already in use" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await User.create({
      fullname,
      password: hashedPassword,
      licenseCode,
      subjects,
    });

    // Generate JWT
    const token = signToken({
      userId: newUser._id,
      fullname: newUser.fullname,
    });

    res.status(201).json({ token, fullname: newUser.fullname });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
