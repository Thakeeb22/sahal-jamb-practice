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
      questions = [];
      data.sections.forEach(section => {
        section.questions.forEach(q => {
          questions.push({
            ...q,
            section: section.section,
            instruction: section.instruction,
            passage: section.passage || null
          });
        });
      });
    } else {
      questions = data.questions || data;
    }

    // Shuffle the questions array
    questions = shuffleArray(questions);

    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: "Failed to read questions" });
  }
}
