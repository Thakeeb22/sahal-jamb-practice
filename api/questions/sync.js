import { connectToDB } from "../_utils/db.js";
import fs from "fs";
import path from "path";
import Question from "../_models/Question.js"; // Make sure this model exists

const __dirname = path.resolve();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectToDB();

    // Clear existing questions (optional, depends on your workflow)
    await Question.deleteMany({});

    const dataDir = path.join(__dirname, "data");
    const files = fs.readdirSync(dataDir);

    let totalQuestions = 0;

    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      const subject = file.replace(".json", "").replace(/_/g, " ");
      const filePath = path.join(dataDir, file);
      const rawData = fs.readFileSync(filePath, "utf-8");
      const questions = JSON.parse(rawData);

      // Apply limits: 60 for English, 40 for others
      const limit = subject.toLowerCase() === "english" ? 60 : 40;
      const selectedQuestions = questions.slice(0, limit);

      const formatted = selectedQuestions.map((q) => ({
        subject,
        question: q.question || q.q,
        options: {
          A: q.optionA || q.A || "",
          B: q.optionB || q.B || "",
          C: q.optionC || q.C || "",
          D: q.optionD || q.D || "",
        },
        answer: q.answer || q.correct_answer || "A",
        examtype: q.examtype || "JAMB",
        examyear: q.examyear || new Date().getFullYear(),
      }));

      await Question.insertMany(formatted);
      totalQuestions += formatted.length;
      console.log(`✅ ${subject}: ${formatted.length} questions synced`);
    }

    return res.status(200).json({
      message: `Questions synced successfully. Total: ${totalQuestions}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to sync questions" });
  }
}
