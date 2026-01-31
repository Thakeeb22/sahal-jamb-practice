import connectDB from "../_utils/db.js";
import Question from "../_models/Question.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    // Optional query param: ?subject=Mathematics
    const subject = req.query.subject;

    let questions;
    if (subject) {
      questions = await Question.find({ subject });
    } else {
      questions = await Question.find({});
    }

    // Return questions without MongoDB _id field for frontend simplicity
    const formatted = questions.map((q) => ({
      subject: q.subject,
      question: q.question,
      options: q.options,
      answer: q.answer,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Questions fetch error:", error);
    res.status(500).json({ message: "Failed to fetch questions" });
  }
}
