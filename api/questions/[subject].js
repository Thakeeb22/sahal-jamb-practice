import fs from "fs";
import path from "path";

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

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
    let questions;

    if (subject.toLowerCase() === "english") {
      // Handle English sections
      let comprehensionQuestions = [];
      let otherQuestions = [];

      data.sections.forEach(section => {
        if (section.section.toLowerCase() === "comprehension") {
          section.questions.forEach(q => {
            comprehensionQuestions.push({
              ...q,
              section: section.section,
              instruction: section.instruction,
              passage: section.passage || null
            });
          });
        } else {
          section.questions.forEach(q => {
            otherQuestions.push({
              ...q,
              section: section.section,
              instruction: section.instruction,
              passage: section.passage || null
            });
          });
        }
      });

      // Shuffle other sections
      otherQuestions = shuffleArray(otherQuestions);

      // Combine: Comprehension first, then shuffled others
      questions = [...comprehensionQuestions, ...otherQuestions];

      // Limit to 60 questions
      questions = questions.slice(0, 60);
    } else {
      questions = data.questions || data;
      // Limit to 40 questions
      questions = questions.slice(0, 40);
    }

    // Shuffle the questions array (for non-English, or if needed)
    questions = shuffleArray(questions);

    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: "Failed to read questions" });
  }
}
