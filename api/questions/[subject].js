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
      let comprehension = [];
      let others = [];

      data.sections.forEach((section) => {
        const mapped = section.questions.map((q) => ({
          ...q,
          section: section.section,
          instruction: section.instruction,
          passage: section.passage || null,
        }));

        if (section.section.toLowerCase() === "comprehension") {
          comprehension.push(...mapped);
        } else {
          others.push(...mapped);
        }
      });

      comprehension = shuffleArray(comprehension).slice(0, 10); // JAMB style
      others = shuffleArray(others).slice(0, 50);

      questions = shuffleArray([...comprehension, ...others]);
    }

    // Shuffle ONLY non-English subjects
    if (subject.toLowerCase() !== "english") {
      questions = shuffleArray(questions);
    }

    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: "Failed to read questions" });
  }
}
