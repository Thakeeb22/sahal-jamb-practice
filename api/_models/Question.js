import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
});

export default mongoose.models.Question ||
  mongoose.model("Question", QuestionSchema);
