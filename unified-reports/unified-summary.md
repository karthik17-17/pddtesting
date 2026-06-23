# 🚀 NeuroStay AI Consolidated CI/CD Test Dashboard

**Build Number:** #local · **Execution Date:** 2026-06-23 11:01:51 UTC · **Branch:** `main`

---

## 🛠️ Build Summary
- **Android APK Build:** ✅ SUCCESS
- **Web App Deploy:** ✅ SUCCESS

---

## 📊 Executive Testing Status Board

| Testing Tier | Total Test Cases | Passed | Failed | Skipped | Pass Rate / Score | Status | Report URL |
|--------------|------------------|--------|--------|---------|-------------------|--------|------------|
| **🌐 Web Application E2E** | 400 | 400 | 0 | 0 | **100.00%** | ✅ PASS | [Excel Report](https://karthik17-17.github.io/pddtesting/web-reports/selenium-test-report.xlsx) |
| **📱 Android Mobile E2E** | 470 | 470 | 0 | 0 | **100.0%** | ✅ PASS | [HTML Report](https://karthik17-17.github.io/pddtesting/android-reports/reports/latest/HTML/dashboard.html) |
| **⚙️ Backend Service Tests** | 400 | 400 | 0 | 0 | **100.00%** | ✅ PASS | [Excel Report](https://karthik17-17.github.io/pddtesting/backend-reports/functional-test-report.xlsx) |
| **🛡️ Backend Security Scan** | 400 (Rules Checked) | — | — | — | **100/100** | ✅ SECURE | [Vulnerability MD](https://karthik17-17.github.io/pddtesting/security-reports/security-review.md) |
| **📈 Performance Load Test** | 7200 (Reqs) | — | — | — | **100% Success** | ✅ OPTIMAL | [Performance Summary](https://karthik17-17.github.io/pddtesting/security-reports/executive-summary.md) |

---

## 🔒 Security Findings Summary

| Scope | Critical | High | Medium | Low | Status |
|-------|----------|------|--------|-----|--------|
| **Code SAST & Secrets** | 0 | 0 | 0 | 0 | ✅ SECURE |

---

## 📈 Performance Load Metrics

### Baseline / Load Testing
Baseline (Load) Testing evaluates the performance of the system under a normal and expected workload. The objective is to ensure that the application maintains acceptable response times and remains stable when accessed by multiple users simultaneously.

**Test Configuration**
* Number of virtual users: **100**
* Test duration: **1 minute**
* Load pattern: Continuous requests during the entire test period
* Total requests generated: **7200**

### Performance Metrics Observed
* **Requests Per Second (RPS):** **120 requests/second**
* **Minimum Response Time:** **50 ms**
* **Average Response Time:** **250 ms**
* **Maximum Response Time:** **1500 ms**
* **Status rates:** 100% successful, 0% errors

### Interpretation
The results demonstrate that the system can efficiently handle normal traffic conditions with 100 concurrent users while maintaining low response times. An average response time of 250 ms indicates good performance, and the system remains responsive even when thousands of requests are processed within one minute.

---

## 📂 Downloads & Artifacts
- **Excel Reports:**
  - 📊 [Consolidated Unified Summary Excel](https://karthik17-17.github.io/pddtesting/unified-summary.xlsx)
  - 🌐 [Web E2E Excel Report](https://karthik17-17.github.io/pddtesting/web-reports/selenium-test-report.xlsx)
  - 📱 [Android E2E Excel Report](https://karthik17-17.github.io/pddtesting/android-reports/reports/latest/Excel/Automation_Test_Report.xlsx)
  - ⚙️ [Backend Service Excel Report](https://karthik17-17.github.io/pddtesting/backend-reports/functional-test-report.xlsx)
  - 🛡️ [Security Findings Excel](https://karthik17-17.github.io/pddtesting/security-reports/findings.xlsx)
  - 🗂️ [API Endpoint Inventory Excel](https://karthik17-17.github.io/pddtesting/security-reports/endpoint-inventory.xlsx)
- **Detailed Markdown Reports:**
  - 📝 [Dependency Audit Report](https://karthik17-17.github.io/pddtesting/security-reports/dependency-report.md)
  - 📝 [Security Executive Summary](https://karthik17-17.github.io/pddtesting/security-reports/executive-summary.md)
