import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { subject } = req.query;

  if (!subject) return res.status(400).json({ error: "Subject required" });

  const filePath = path.join(process.cwd(), "data", `${subject}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Subject not found" });
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    const questions = data.questions || data;
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: "Failed to read questions" });
  }
}
