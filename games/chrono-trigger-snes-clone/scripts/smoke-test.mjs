import fs from "node:fs";
import path from "node:path";

const required = [
  "src/main.ts",
  "src/scenes/BootScene.ts",
  "src/scenes/MenuScene.ts",
  "src/scenes/PlayScene.ts",
  "src/scenes/ResultScene.ts",
  "index.html"
];

const missing = required.filter((rel) => !fs.existsSync(path.resolve(process.cwd(), rel)));
if (missing.length > 0) {
  console.error("Smoke test failed. Missing files:");
  missing.forEach((entry) => console.error(`- ${entry}`));
  process.exit(1);
}

console.log("Smoke test passed: required scaffold files exist.");
