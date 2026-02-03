import fs from "fs";
import path from "path";

// Shuffle helper
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
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
    let questions = [];

    /* =======================
       ENGLISH (SPECIAL CASE)
    ======================== */
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

        if (section.section.toLowerCase().includes("comprehension")) {
          comprehension.push(...mapped);
        } else {
          others.push(...mapped);
        }
      });

      // JAMB-style distribution
      comprehension = shuffleArray(comprehension).slice(0, 10);
      others = shuffleArray(others).slice(0, 50);

      // 🔒 Passage ALWAYS FIRST
      questions = [...comprehension, ...others];

      // Final guard
      questions = questions.slice(0, 60);
    }

    /* =======================
       OTHER SUBJECTS
    ======================== */
    else {
      const flat = data.questions || data;
      questions = shuffleArray(flat).slice(0, 40);
    }

    return res.status(200).json(questions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load questions" });
  }
}
