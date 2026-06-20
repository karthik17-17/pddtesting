# NeuroStay AI - Android E2E Appium Automation Framework

This directory houses the enterprise-grade automated testing framework for the NeuroStay AI mobile Android application. The framework integrates Appium, WebdriverIO (TypeScript), and Custom reporting engines (Excel & HTML) to execute, track, and publish reports for over 500 test cases.

---

## 📂 Folder Structure

```
automation/
│
├── config/
│   └── appium.config.ts        # Appium server & Android capability options
│
├── data/
│   └── testCases.ts            # Complete database defining 510 test cases
│
├── pages/                      # Page Object Model (POM) classes
│   ├── BasePage.ts             # Common Appium UI interaction wrappers
│   ├── LoginPage.ts            # Authentication locators & logic
│   ├── RegisterPage.ts         # User registration locators & logic
│   ├── HomePage.ts             # Bottom navigation & dashboard items
│   └── ProfilePage.ts          # Profile edit and logout actions
│
├── runners/
│   └── testRunner.ts           # Central runner (real UI and simulated executions)
│
├── utils/
│   ├── excelReportGenerator.ts # Styling and writing of the 4 Excel reports
│   ├── htmlReportGenerator.ts  # Compilation of Dashboard, Test Log, and Trends
│   ├── logger.ts               # File append and terminal output logging
│   └── screenshot.ts           # Emulated and real device screenshot capture
│
├── reports/                    # Generated test artifacts (gitignored)
│   ├── Excel/                  # Master and split xlsx spreadsheets
│   ├── HTML/                   # Sleek interactive logs, dashboards, and trends
│   ├── JSON/                   # raw results in execution-results.json
│   ├── Logs/                   # Device and Appium execution output logfiles
│   ├── Screenshots/            # PNG screens taken on failures/asserts
│   └── Summary/                # Markdown report summary
│
├── package.json                # Project dependencies and testing scripts
├── tsconfig.json               # TypeScript compiler config
└── README.md                   # This instruction manual
```

---

## 💻 Local Execution Guide

### Prerequisites
Before running tests locally, ensure you have the following installed on your machine:
1. **Node.js** (v18 or v20 recommended)
2. **Java JDK 17+**
3. **Android Studio** (with Android SDK and emulator configured)
4. **Appium Server**:
   ```bash
   npm install -g appium
   appium driver install uiautomator2
   ```

### 1. Install Dependencies
Navigate to the `automation/` folder and run npm install:
```bash
cd automation
npm install
```

### 2. Run in Simulated Fallback Mode (Fast & Unsandboxed)
To test the runner execution logic, Excel, HTML, and JSON report generation immediately without starting an emulator or Appium:
```bash
npm run test:simulated
```
*This executes all 510 tests programmatically inside ~15 seconds and compiles the reports inside `automation/reports/`.*

### 3. Run in Real E2E Mode
To execute real tests against the emulator:
1. Open Android Studio and launch your virtual device (AVD name should match configuration or be active).
2. Start the Appium Server:
   ```bash
   appium
   ```
3. Build the Android debug APK in the mobile app folder:
   ```bash
   cd ../neurostay-mobile/android
   ./gradlew assembleDebug
   ```
4. Run the test suite:
   ```bash
   cd ../../automation
   npm run test
   ```
*The runner will connect to Appium on port 4723, install the APK, perform real taps/inputs, and output final reports.*

---

## 🚀 CI/CD Execution Guide

The GitHub Actions pipeline is configured in `.github/workflows/android-e2e.yml`. It runs automatically on every `push` and `pull_request` to `main` or `master`, on a daily `schedule` (2:00 AM UTC), or via manual triggering (`workflow_dispatch`).

### Execution Pipeline Stages:
1. **Checkout Repository**: Clones code to the GitHub Actions runner.
2. **Setup Java**: Configures JDK 17 (Temurin).
3. **Setup Android SDK**: Configures environment paths.
4. **Install Android Dependencies**: Downloads node modules for the Expo app.
5. **Build APK**: Compiles the debug application using `./gradlew assembleDebug`.
6. **Start Emulator**: Initiates the emulator environment in a macOS virtual environment (`macos-13` runner).
7. **Verify Emulator Readiness**: Waits for `adb` connection.
8. **Install APK**: Automatically pushes the compiled `.apk` to the active emulator.
9. **Start Appium Server**: Installs Appium and the `uiautomator2` driver, launching it in the background.
10. **Verify Appium Health**: pings the status endpoint to verify Appium is ready.
11. **Execute Appium E2E Tests**: Invokes `npm run test` in the `automation/` directory.
12. **Capture Screenshots & Logs**: Collects logs and images upon failures.
13. **Generate Reports**: Generates Master Excel, Passed, Failed, Summary worksheets, JSON results, HTML dashboards, logs, and a step summary.
14. **Upload Artifacts**: Uploads reports to GitHub Actions artifacts (30 days retention).
15. **Publish to GitHub Pages**: Pushes reports to the `gh-pages` branch, archiving past builds under `history/build-N/` and updating the latest directory.
16. **Publish Summary**: Appends metrics to the GHA step summary.

---

## 🔧 Repository Configuration Guide

To deploy the generated reports to GitHub Pages automatically, you must configure permissions in your GitHub repository:

1. **Enable GitHub Pages**:
   - Go to your GitHub repository -> **Settings** -> **Pages**.
   - Under **Build and deployment**, select **Deploy from a branch**.
   - Set the branch to `gh-pages` and folder to `/` (Root), then click **Save**.
2. **Configure Workflow Permissions**:
   - Go to **Settings** -> **Actions** -> **General**.
   - Scroll down to **Workflow permissions**.
   - Select **Read and write permissions** (this allows the bot to push built reports to the `gh-pages` branch).
   - Check **Allow GitHub Actions to create and approve pull requests** if required, then click **Save**.

### Accessing the Live Reports
Once the pipeline runs, the reports will be available at:
- **Interactive Dashboard**: `https://<github-username>.github.io/<repository-name>/reports/latest/HTML/dashboard.html`
- **Interactive Test Log**: `https://<github-username>.github.io/<repository-name>/reports/latest/HTML/execution-report.html`
- **Trends Chart**: `https://<github-username>.github.io/<repository-name>/reports/latest/HTML/trends.html`

---

## 🛠️ Troubleshooting Guide

### 1. Appium Session Fails to Initialize
- **Symptom**: `Failed to connect to Appium` or `SessionNotCreatedException`.
- **Mitigation**:
  - Verify that the Appium server is running locally on port `4723`.
  - Check the output of `adb devices` to make sure your emulator/phone is visible.
  - Verify that the path to the APK in `automation/config/appium.config.ts` matches your directory structure.

### 2. Emulator Startup Fails or Hangs in CI
- **Symptom**: Step `Start Emulator` times out or exits with code 1.
- **Mitigation**:
  - The workflow runs on `macos-13` which utilizes Intel virtualization, making the Android emulator run natively and reliably. Avoid using `ubuntu-latest` as it uses software emulation, which is extremely slow and causes startup timeouts.
  - If it hangs locally, wipe the emulator's data in the Android Studio Device Manager and start it with `-no-snapshot`.

### 3. OutOfMemory Exceptions During Large File Upload Test
- **Symptom**: Test Case `TC_FILE_002` causes application crash.
- **Mitigation**:
  - This is a deliberate failure scenario designed to test heap limitations. If the application crashes, Appium captures the exception stack trace and dumps device logcat to `automation/reports/Logs/device-logs.log` for inspection. This confirms that error-capturing mechanisms are working correctly!

### 4. GitHub Pages Deployment Returns Permission Denied
- **Symptom**: git push in the deployment step fails with `403 Forbidden`.
- **Mitigation**:
  - Make sure you enabled **Read and write permissions** in the repository settings (Settings -> Actions -> General -> Workflow Permissions).
