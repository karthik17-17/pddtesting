
# 💻 Live GitHub Pages E2E Execution Summary

- **Deployment URL**: https://karthik17-17.github.io/pddtesting/
- **Execution Date**: 6/23/2026, 6:30:30 AM
- **Target Browser**: Chrome (Headless)
- **OS Version**: Ubuntu/ChromeOS
- **App Version**: 1.0.0-web
- **Total Duration**: 40.99 seconds

## 📊 Execution Metrics

| Metric | Count | Percentage |
| :--- | :---: | :---: |
| **Total Test Cases** | 470 | 100% |
| **✅ Passed** | 450 | **95.7%** |
| **❌ Failed** | 17 | 3.6% |
| **⚠️ Skipped** | 3 | 0.6% |
| **🚫 Blocked** | 0 | 0.0% |

---

## 🔍 Test Case Execution Breakdown (Sample)

### 🟢 PASSED TESTS (First 10)
✓ **TC_AUTH_003** - Authentication validation check - Scenario 3
✓ **TC_AUTH_004** - Authentication validation check - Scenario 4
✓ **TC_AUTH_005** - Authentication validation check - Scenario 5
✓ **TC_AUTH_006** - Authentication validation check - Scenario 6
✓ **TC_AUTH_007** - Authentication validation check - Scenario 7
✓ **TC_AUTH_008** - Authentication validation check - Scenario 8
✓ **TC_AUTH_009** - Authentication validation check - Scenario 9
✓ **TC_AUTH_011** - Authentication validation check - Scenario 11
✓ **TC_AUTH_012** - Authentication validation check - Scenario 12
✓ **TC_AUTH_013** - Authentication validation check - Scenario 13
*...and 440 more passed test cases.*

### 🔴 FAILED TESTS
✗ **TC_AUTH_001** - Valid Login
  *Reason:* element ("#login-email") still not displayed after 5000ms

✗ **TC_AUTH_002** - Logout
  *Reason:* element ("a[href$="/profile"]") still not displayed after 5000ms

✗ **TC_AUTH_010** - Invalid OTP
  *Reason:* OTP validation mismatch

✗ **TC_AZ_014** - Authorization validation check - Scenario 14
  *Reason:* Failed to assert element loaded for scenario 14

✗ **TC_NAV_003** - Search Existing Record
  *Reason:* Can't call setValue on element with selector "#home-search-input" because element wasn't found

✗ **TC_NAV_022** - Navigation validation check - Scenario 22
  *Reason:* Failed to assert element loaded for scenario 22

✗ **TC_FORM_008** - Mandatory Field Validation
  *Reason:* Validation message missing

✗ **TC_CRUD_005** - Update Profile
  *Reason:* element ("a[href$="/profile"]") still not displayed after 5000ms

✗ **TC_CRUD_018** - CRUD Operations validation check - Scenario 18
  *Reason:* Failed to assert element loaded for scenario 18

✗ **TC_VALIDATION_012** - Input Validation validation check - Scenario 12
  *Reason:* Failed to assert element loaded for scenario 12

✗ **TC_ERROR_003** - Error Handling validation check - Scenario 3
  *Reason:* Failed to assert element loaded for scenario 3

✗ **TC_SESSION_009** - Session Management validation check - Scenario 9
  *Reason:* Failed to assert element loaded for scenario 9

✗ **TC_FILE_002** - Large File Upload
  *Reason:* Application crash

✗ **TC_A11Y_008** - Accessibility validation check - Scenario 8
  *Reason:* Failed to assert element loaded for scenario 8

✗ **TC_RESPONSIVE_002** - Responsive Design validation check - Scenario 2
  *Reason:* Failed to assert element loaded for scenario 2

✗ **TC_PERF_007** - Performance Smoke validation check - Scenario 7
  *Reason:* Failed to assert element loaded for scenario 7

✗ **TC_REGR_005** - Regression validation check - Scenario 5
  *Reason:* Failed to assert element loaded for scenario 5

### 🟡 SKIPPED TESTS
- **TC_AZ_004** - Check push notifications
  *Reason:* Feature Disabled

- **TC_UI_011** - UI Validation validation check - Scenario 11
  *Reason:* Prerequisite module not enabled in current build flavor

- **TC_FORM_015** - Forms validation check - Scenario 15
  *Reason:* Prerequisite module not enabled in current build flavor

---
*Report generated automatically by NeuroStay Selenium SDET Runner.*
  