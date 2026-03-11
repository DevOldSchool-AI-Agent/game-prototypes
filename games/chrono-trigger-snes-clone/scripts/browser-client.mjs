import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import puppeteer from "puppeteer";

const artifactDir = path.resolve(process.cwd(), "qa-artifacts");
await fs.mkdir(artifactDir, { recursive: true });

const devServer = spawn("npm", ["run", "dev", "--", "--host", "127.0.0.1", "--port", "4173"], {
  cwd: process.cwd(),
  stdio: ["ignore", "pipe", "pipe"]
});

const waitForReady = () =>
  new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Dev server startup timed out")), 30000);
    const onData = (buffer) => {
      const line = buffer.toString();
      if (line.includes("http://127.0.0.1:4173")) {
        clearTimeout(timeout);
        devServer.stdout.off("data", onData);
        resolve(undefined);
      }
    };
    devServer.stdout.on("data", onData);
    devServer.stderr.on("data", (buffer) => {
      const line = buffer.toString();
      if (line.toLowerCase().includes("error")) {
        clearTimeout(timeout);
        reject(new Error(line));
      }
    });
  });

let browser;
let page;
const consoleErrors = [];

try {
  await waitForReady();
  browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  page = await browser.newPage();
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.setViewport({ width: 1280, height: 720 });
  await page.goto("http://127.0.0.1:4173", { waitUntil: "networkidle2" });
  await page.keyboard.press("Enter");
  await new Promise((resolve) => setTimeout(resolve, 240));
  await page.keyboard.down("ArrowRight");
  await new Promise((resolve) => setTimeout(resolve, 340));
  await page.keyboard.up("ArrowRight");
  await page.keyboard.press("Space");
  await new Promise((resolve) => setTimeout(resolve, 240));

  const textState = await page.evaluate(() => window.render_game_to_text());
  await fs.writeFile(path.join(artifactDir, "render_game_to_text.json"), `${textState}\n`, "utf8");

  await page.screenshot({ path: path.join(artifactDir, "smoke-run.png") });
  await fs.writeFile(path.join(artifactDir, "console-errors.json"), `${JSON.stringify(consoleErrors, null, 2)}\n`, "utf8");

  if (consoleErrors.length > 0) {
    throw new Error(`Console errors captured: ${consoleErrors.length}`);
  }

  console.log("Browser QA passed.");
} finally {
  if (browser) {
    await browser.close();
  }
  devServer.kill("SIGTERM");
}
