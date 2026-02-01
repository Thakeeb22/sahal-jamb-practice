import connectDB from "../_utils/db.js";
import User from "../_models/User.js";
import { comparePassword } from "../_utils/hash.js";
import { signToken } from "../_utils/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { fullname, password } = req.body;

    // Validate input
    if (!fullname || !password) {
      return res
        .status(400)
        .json({ message: "Fullname and password are required" });
    }

    // Find user
    const user = await User.findOne({ fullname });
    if (!user) {
      return res.status(401).json({ message: "Invalid fullname or password" });
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid fullname or password" });
    }

    // Generate JWT
    const token = signToken({ userId: user._id, fullname: user.fullname });

    res.status(200).json({ token, fullname: user.fullname, subjects: user.subjects });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
