# 🖥️ NeuroStay AI - E2E Testing & CI/CD Guide

This repository contains an enterprise-grade automated testing and deployment pipeline for the NeuroStay AI application. The web application builds, deploys to GitHub Pages, and triggers a suite of **470+ automated Selenium test cases** against the live deployment, capturing and publishing test results dynamically.

---

## 📂 Framework Folder Structure

The automation suite is configured inside the `automation/` folder:
```
automation/
│
├── config/
│   └── selenium.config.ts      # WebdriverIO & Headless Chrome capabilities
│
├── data/
│   └── testCases.ts            # Data sheet containing 470 test case specifications
│
├── pages/                      # Page Object Model (POM) classes
│   ├── BasePage.ts             # Base actions wrapper (click, type, wait)
│   ├── LoginPage.ts            # Login page elements and methods
│   ├── HomePage.ts             # Dashboard and bottom navigation elements
│   ├── ProfilePage.ts          # Profile editing and logout methods
│   └── RegisterPage.ts         # User registration elements
│
├── runners/
│   └── testRunner.ts           # Central test runner executing tests & processing exits
│
├── utils/
│   ├── excelReportGenerator.ts # Excel workbook compiling master and status sheets
│   ├── htmlReportGenerator.ts  # HTML interactive dashboard compiler
│   ├── logger.ts               # File and terminal output logger
│   └── screenshot.ts           # Failure visual evidence capturer
│
├── reports/                    # Generated execution artifacts (gitignored)
│   ├── Excel/                  # Master & split spreadsheets (Automation_Test_Report.xlsx)
│   ├── HTML/                   # Interactive dashboard, logs, and trend pages
│   ├── JSON/                   # raw execution-results.json
│   ├── Logs/                   # Log outputs (selenium-execution.log, browser-console.log)
│   ├── Screenshots/            # Failure/error visual captures
│   └── Summary/                # Markdown report summary (summary.md)
│
├── package.json                # Project dependencies (webdriverio, exceljs, typescript)
└── tsconfig.json               # TypeScript compilation settings
```

---

## 💻 Local Execution Guide

### 1. Prerequisites
Ensure the following tools are installed on your machine:
* **Node.js** (v18.x or v20.x recommended)
* **Google Chrome browser**

### 2. Install Dependencies
Navigate to the `automation/` directory and run:
```bash
cd automation
npm install
```

### 3. Run Simulated Mode (Report Validation)
To immediately run all 470 test cases programmatically and compile Excel and HTML reports:
```bash
npm run test:simulated
```
*This command completes in ~15 seconds, creating all report assets inside `automation/reports/`.*

### 4. Run Real Web E2E Mode
To execute real GUI-based assertions against a browser using headless Chrome:
1. Set the target application URL environment variable:
   ```bash
   # Windows (PowerShell)
   $env:BASE_URL="https://karthik17-17.github.io/pddtesting/"
   
   # Linux/macOS
   export BASE_URL="https://karthik17-17.github.io/pddtesting/"
   ```
2. Build and run the test suite:
   ```bash
   npm run build
   npm test
   ```

---

## 🚀 CI/CD Pipeline Stages

The GitHub Actions workflow is defined in [deploy-and-test.yml](file:///c:/projects/neurostay-ai/.github/workflows/deploy-and-test.yml). It executes the following 13 sequential stages on every push, pull request, or manual trigger:

1. **Stage 1 - Checkout Repository**: Clones the source code using `actions/checkout@v4`.
2. **Stage 2 - Install Dependencies**: Configures Node.js and runs `npm install` in the frontend and automation folders.
3. **Stage 3 - Build Frontend Application**: Builds the Vite application utilizing `--base=/pddtesting/` relative routing.
4. **Stage 4 - Run Static Analysis**: Checks formatting and linting using `npm run lint`.
5. **Stage 5 - Deploy Frontend to GitHub Pages**: Checks out the `gh-pages` branch, deploys compiled code to the root, and pushes updates while preserving reports history.
6. **Stage 6 - Wait for Pages Deployment**: Suspends execution for 30 seconds for the GitHub Page CDN to serve updated resources.
7. **Stage 7 - Deployment Verification**: Pings the live URL, index.html, and CSS/JS bundle paths verifying `HTTP 200`.
8. **Stage 8 - Run Selenium E2E Tests**: Executes the test suite against the live GitHub Pages URL.
9. **Stage 9 - Generate Reports**: Compiles HTML dashboard, test logs, and logs files.
10. **Stage 10 - Generate Excel Reports**: Writes `Automation_Test_Report.xlsx`, `Passed_Test_Cases.xlsx`, `Failed_Test_Cases.xlsx`, and `Summary_Report.xlsx`.
11. **Stage 11 - Upload Artifacts**: Compiles the report files and uploads them to the GitHub run artifacts (30 days retention).
12. **Stage 12 - Publish Action Summary**: Publishes interactive report links and test case summaries directly to the GitHub Actions Job Summary.
13. **Stage 13 - Store Historical Results**: Version-archives the reports under `reports/history/build-N/` and copies the new reports to `reports/latest/` inside the `gh-pages` branch.

---

## 🔧 Repository Configuration Guide

To deploy the frontend and reports to GitHub Pages successfully, configure your repository settings as follows:

### 1. Enable GitHub Pages
1. Navigate to your repository on GitHub.
2. Go to **Settings** -> **Pages**.
3. Under **Build and deployment** -> **Source**, select **Deploy from a branch**.
4. Choose the **`gh-pages`** branch and folder **`/ (root)`**, then click **Save**.

### 2. Workflow Permissions
1. Go to **Settings** -> **Actions** -> **General**.
2. Scroll to the bottom of the page to **Workflow permissions**.
3. Select **Read and write permissions** (required for the action to push built assets to `gh-pages`).
4. Select **Allow GitHub Actions to create and approve pull requests** and click **Save**.

### 3. Accessing the Live Web Reports
Once the pipeline runs, the reports are served at the following URLs:
* **Interactive Dashboard**: `https://<github-username>.github.io/<repository-name>/reports/latest/HTML/dashboard.html`
* **Execution Test Log**: `https://<github-username>.github.io/<repository-name>/reports/latest/HTML/execution-report.html`
* **Historical Trends**: `https://<github-username>.github.io/<repository-name>/reports/latest/HTML/trends.html`

---

## 🛠️ Troubleshooting Guide

### 1. Curl Verification Fails (Stage 7)
* **Symptom**: Step `Stage 7 - Deployment Verification` fails with `HTTP 404` or `HTTP 503`.
* **Causes**: The GitHub Page build has not finished deploying or CDN propagation is slow.
* **Resolution**: Check the "GitHub Pages" deployment history status in the repository tabs. Increase the sleep timeout in Stage 6 to 45s or 60s if the deployment takes longer to propagate.

### 2. Git Commit/Push Fails (Stage 5 or Stage 13)
* **Symptom**: Git push fails with `403 Forbidden` error inside the deployment logs.
* **Causes**: The GitHub Actions GITHUB_TOKEN has insufficient write permissions.
* **Resolution**: Verify that the workflow permissions are set to "Read and write permissions" under Settings -> Actions -> General.

### 3. WebDriver Fails to Initialize Headless Chrome
* **Symptom**: `Failed to connect to Headless Chrome` message shown in logger.
* **Causes**: Running in an environment lacking Chrome binary installations.
* **Resolution**: Under local Linux platforms, make sure Chrome is installed. On the GHA runner, `ubuntu-latest` comes with Google Chrome pre-installed natively.

### 4. Failed Test Debugging
* **Procedure**: 
  1. Open the Action run on GitHub and download the `Selenium-E2E-Reports-Build-N` zip file.
  2. Inspect the `logs/selenium-execution.log` file for step-by-step logs.
  3. Inspect `logs/browser-console.log` to view console errors output by the React web application.
  4. View screenshots under the `screenshots/` directory matching the failed Test ID (e.g. `TC_AUTH_010.png`).
