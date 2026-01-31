import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const dataDir = path.join(process.cwd(), "data");
  const files = fs.readdirSync(dataDir);

  const subjects = files
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));

  res.status(200).json(subjects);
}
