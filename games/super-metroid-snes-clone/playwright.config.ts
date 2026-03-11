import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  use: {
    baseURL: "http://127.0.0.1:4174",
    headless: true,
    trace: "on-first-retry",
    video: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4174",
    port: 4174,
    reuseExistingServer: false,
    timeout: 120000
  }
});
