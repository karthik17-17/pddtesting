# Dependency Vulnerability Report

**Date:** 2026-06-23 11:27:20 UTC · **Build:** #6

## Tools Used
- npm audit (Frontend + Mobile)
- Trivy filesystem scan

## Audit Results

```
## 📦 Frontend Dependency Audit
found 0 vulnerabilities

## 📦 Mobile Dependency Audit
        Depends on vulnerable versions of @expo/config
        node_modules/expo-constants
          expo-asset  <=0.0.1-canary-20240418-8d74597 || 8.6.1 - 55.0.0-canary-20260223-05214f1 || 55.0.3-canary-20260128-67ce8d5 || 55.0.8-canary-20260424-7bedc9d - 55.0.8-canary-20260429-a5e59cf || 55.0.11-canary-20260327-0789fbc - 55.0.11-canary-20260402-9da566b || 56.0.0-canary-20260212-4f61309 - 56.0.0-canary-20260506-964f25d
          Depends on vulnerable versions of expo-constants
          node_modules/expo/node_modules/expo-asset
          expo-linking  <=0.0.1-canary-20240418-8d74597 || 2.2.2 - 55.0.0-canary-20260223-05214f1 || 55.0.4-canary-20260128-67ce8d5 || 55.0.8-canary-20260424-7bedc9d - 55.0.8-canary-20260429-a5e59cf || 55.0.10-canary-20260327-0789fbc - 55.0.10-canary-20260402-9da566b || 56.0.0-canary-20260212-4f61309 - 56.0.0-canary-20260506-964f25d
          Depends on vulnerable versions of expo-constants
          node_modules/expo-linking
          expo-router  <=0.0.33 || 4.0.13-canary-20241211-61c49bd || 4.0.18-canary-20250124-42fe332 - 4.0.18-canary-20250306-d9d3e02 || 4.0.20-canary-20250320-7a205d3 || 4.0.21 - 5.0.2-preview.6 || 5.2.0-canary-20250611-f0afe80 - 55.0.0-canary-20260223-05214f1 || 55.0.3-canary-20260424-7bedc9d - 55.0.3-canary-20260429-a5e59cf || 55.0.9-canary-20260327-0789fbc - 55.0.9-canary-20260402-9da566b || 56.0.0-canary-20260212-4f61309 - 56.0.0-canary-20260506-964f25d
          Depends on vulnerable versions of expo-constants
          Depends on vulnerable versions of expo-linking
          node_modules/expo-router
      @expo/prebuild-config  *
      Depends on vulnerable versions of @expo/config
      Depends on vulnerable versions of @expo/config-plugins
      node_modules/@expo/prebuild-config
        expo-splash-screen  <=0.0.1-canary-20240418-8d74597 || 0.11.0 - 56.0.0-canary-20260506-964f25d
        Depends on vulnerable versions of @expo/prebuild-config
        node_modules/expo-splash-screen

23 vulnerabilities (22 moderate, 1 high)

To address issues that do not require attention, run:
  npm audit fix

To address all issues possible (including breaking changes), run:
  npm audit fix --force

Some issues need review, and may require choosing
a different dependency.

```

## Recommendations
- Run `npm audit fix` to auto-remediate low-risk vulnerabilities.
- Review and manually update packages flagged as HIGH or CRITICAL.
- Consider pinning dependency versions and using `npm ci` in production.
