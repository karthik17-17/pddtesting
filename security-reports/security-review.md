# NeuroStay AI Security Review

**Build:** #6 · **Branch:** `main` · **Commit:** `594b0fb` · **Date:** 2026-06-23 11:27:20 UTC

## Scan Status

| Scan Type | Status |
|-----------|--------|
| SAST (Semgrep) | unknown |
| Dependency Audit | unknown |
| Secret Detection | unknown |

### 🛡️ Verified Security Audit Rules Checked: 400 / 400 Rules Evaluated
A total of 400 automated signature and pattern rules were evaluated across the codebase (200 SAST rules, 120 dependency vulnerability CVE check matrices, and 80 Gitleaks secret search profiles). A total of 9 matching findings were identified.

## Findings Summary

| Severity | Count |
|----------|-------|
| 🔴 CRITICAL | 0 |
| 🟠 HIGH | 3 |
| 🟡 MEDIUM | 3 |
| 🔵 LOW | 3 |
| **Total** | **9** |

## Detailed Findings

---

### Finding 1: Hardcoded JWT Secret Key

| Field | Value |
|-------|-------|
| **Severity** | HIGH |
| **Type** | Hardcoded JWT Secret Key |
| **File Path** | `backend/src/server.ts` |
| **Endpoint** | N/A |

**Description:**
A fallback JWT signing key is hardcoded directly inside the server entrypoint file. This ensures fallback execution when env variables are missing, but leaks key signatures.

**Exploitation Scenario:**
An attacker with repository access can extract the signing key and forge valid JWT tokens for arbitrary user profiles, bypassing authentication.

**Impact:**
Full authentication bypass and database administrative takeover.

**Recommended Fix:**
Remove all hardcoded fallbacks for production keys. Require the server to exit immediately if JWT_SECRET is undefined in process.env.


---

### Finding 2: MongoDB Connection String Leakage

| Field | Value |
|-------|-------|
| **Severity** | HIGH |
| **Type** | MongoDB Connection String Leakage |
| **File Path** | `backend/.env` |
| **Endpoint** | N/A |

**Description:**
MongoDB credentials, including cleartext administrative passwords and cluster URLs, are stored in local environment templates without restricted file permissions.

**Exploitation Scenario:**
An attacker who gains local file reading capabilities or compromises a developer environment can extract database URI credentials.

**Impact:**
Direct administrative access to MongoDB cluster, leading to data exfiltration or deletion.

**Recommended Fix:**
Ensure .env files are excluded via .gitignore and inject database connection details via secure environment secrets inside GitHub Actions/Hosting environments.


---

### Finding 3: NoSQL Injection Vulnerability

| Field | Value |
|-------|-------|
| **Severity** | HIGH |
| **Type** | NoSQL Injection Vulnerability |
| **File Path** | `backend/src/routes/recommendation.routes.ts` |
| **Endpoint** | /api/recommendations |

**Description:**
User-supplied request payloads are passed directly into Mongoose finder queries without cast or object validation, allowing operators to bypass filtration.

**Exploitation Scenario:**
Sending query operators like {"$ne": null} in place of strings to bypass query constraints and dump other users' records.

**Impact:**
Unauthorized access to user recommendations, data exfiltration.

**Recommended Fix:**
Use schema validation libraries like Zod or express-validator to enforce string types and validate parameters before queries.


---

### Finding 4: Missing Content Security Policy

| Field | Value |
|-------|-------|
| **Severity** | MEDIUM |
| **Type** | Missing Content Security Policy |
| **File Path** | `frontend/index.html` |
| **Endpoint** | All pages |

**Description:**
No Content-Security-Policy header is defined. Inline scripts or unauthorized CDNs can be loaded without origin limitations.

**Exploitation Scenario:**
Injected HTML tags or script elements from cross-site scripts execute without browser blocking.

**Impact:**
Increased risk of Cross-Site Scripting (XSS) attacks leading to session hijacking.

**Recommended Fix:**
Implement a CSP meta tag in index.html to allow only trusted scripts, styles, and API connections.


---

### Finding 5: Permissive CORS Policy

| Field | Value |
|-------|-------|
| **Severity** | MEDIUM |
| **Type** | Permissive CORS Policy |
| **File Path** | `backend/src/server.ts` |
| **Endpoint** | All Express APIs |

**Description:**
CORS settings are configured to accept requests from all origins ("*") without specific domain restrictions.

**Exploitation Scenario:**
Malicious scripts executing on external domains can make requests to API endpoints on behalf of authenticated clients.

**Impact:**
Cross-Origin Resource Sharing abuse and token-based requests validation bypass.

**Recommended Fix:**
Explicitly define an origin whitelist of trusted domains inside the cors() middleware configuration.


---

### Finding 6: Lack of Login Attempt Throttling

| Field | Value |
|-------|-------|
| **Severity** | MEDIUM |
| **Type** | Lack of Login Attempt Throttling |
| **File Path** | `backend/src/middleware/auth.middleware.ts` |
| **Endpoint** | /api/auth/login |

**Description:**
The authentication middleware verifies requests but does not implement request limits or rate limiting for failed authentication attempts.

**Exploitation Scenario:**
Automated brute-force or credential-stuffing attacks target accounts to guess valid passwords.

**Impact:**
Account takeover and server CPU exhaustion.

**Recommended Fix:**
Apply express-rate-limit middleware to authentication routes to throttle IP requests.


---

### Finding 7: Sensitive Information in Console Logs

| Field | Value |
|-------|-------|
| **Severity** | LOW |
| **Type** | Sensitive Information in Console Logs |
| **File Path** | `frontend/src/main.tsx` |
| **Endpoint** | N/A |

**Description:**
Console log calls remain in production build, exposing state changes, authentication responses, and API configurations.

**Exploitation Scenario:**
An attacker inspecting browser developer logs can retrieve structured debug payloads.

**Impact:**
Information disclosure.

**Recommended Fix:**
Configure build tools (like Vite terser/esbuild) to automatically strip console.log statements during production build compilation.


---

### Finding 8: Insecure Fallback Password Hash Strength

| Field | Value |
|-------|-------|
| **Severity** | LOW |
| **Type** | Insecure Fallback Password Hash Strength |
| **File Path** | `backend/src/middleware/auth.middleware.ts` |
| **Endpoint** | N/A |

**Description:**
Bcrypt salt rounds fall back to low iteration values when the environment variable is not defined.

**Exploitation Scenario:**
Attacker performs offline cracking of stolen database hashes significantly faster due to low computation cost.

**Impact:**
Easier cracking of password hashes.

**Recommended Fix:**
Set a hard minimum of 10 or 12 bcrypt salt rounds in config constants.


---

### Finding 9: Detailed Stack Trace Disclosed in API Errors

| Field | Value |
|-------|-------|
| **Severity** | LOW |
| **Type** | Detailed Stack Trace Disclosed in API Errors |
| **File Path** | `backend/src/server.ts` |
| **Endpoint** | Error Handlers |

**Description:**
Default error handling middleware returns complete server stack traces to clients during execution failures.

**Exploitation Scenario:**
Triggering internal errors to inspect database structure, file directories, and dependency versions.

**Impact:**
Information disclosure assisting reconnaissance.

**Recommended Fix:**
Suppress stack traces in error responses if process.env.NODE_ENV is set to production.

