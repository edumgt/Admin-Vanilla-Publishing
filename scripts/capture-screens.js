const fs = require("node:fs/promises");
const path = require("node:path");
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch (error) {
  ({ chromium } = require("playwright-core"));
}

const BASE_URL = process.env.CAPTURE_BASE_URL || "http://127.0.0.1:8000";
const REPO_ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(REPO_ROOT, "DOCS");

const onPremK8sState = {
  environmentType: "onprem",
  onPremMode: "kubernetes",
  profileName: "admin-vanilla-onprem",
  allowedOrigin: "https://intra.example.com",
  appDomain: "app.example.com",
  apiDomain: "api.example.com",
  awsRegion: "ap-northeast-2",
  awsStackName: "admin-vanilla-platform",
  frontendBucketName: "admin-vanilla-frontend-prod",
  dockerProjectName: "admin-vanilla",
  frontendPort: "8080",
  backendPort: "8000",
  postgresPort: "5432",
  k8sNamespace: "admin-vanilla",
  ingressHost: "intra.example.com",
  apiIngressHost: "api.intra.example.com",
  k8sReplicas: "3",
};

async function capture(page, targetPath, setup) {
  if (setup) {
    await setup(page);
  }
  await page.screenshot({ path: targetPath, fullPage: true });
}

async function captureConfigAws(browser) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1800 } });
  await page.addInitScript(() => {
    localStorage.removeItem("paasSetupProfile");
  });
  await page.goto(`${BASE_URL}/config.html`, { waitUntil: "networkidle" });
  await page.waitForSelector(".architecture-visual img");
  await capture(page, path.join(OUTPUT_DIR, "paas-setup-aws.png"));
  await page.close();
}

async function captureConfigOnPremK8s(browser) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 2200 } });
  await page.addInitScript((state) => {
    localStorage.setItem("paasSetupProfile", JSON.stringify(state));
  }, onPremK8sState);
  await page.goto(`${BASE_URL}/config.html`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => {
    const chip = document.querySelector("#environment-chip");
    return chip && chip.textContent.includes("Kubernetes");
  });
  await capture(page, path.join(OUTPUT_DIR, "paas-setup-onprem-k8s.png"));
  await page.close();
}

async function captureBlueMarble(browser) {
  const page = await browser.newPage({ viewport: { width: 1660, height: 1280 } });
  await page.goto(`${BASE_URL}/burumable.html?demo=1`, { waitUntil: "networkidle" });
  await page.waitForSelector("#board");
  await page.waitForTimeout(1200);
  await capture(page, path.join(OUTPUT_DIR, "burumable-3d.png"));
  await page.close();
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    await captureConfigAws(browser);
    await captureConfigOnPremK8s(browser);
    await captureBlueMarble(browser);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
