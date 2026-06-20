"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTestCases = generateTestCases;
const modulePrefixes = {
    'Authentication': 'AUTH',
    'Authorization': 'AZ',
    'Registration': 'REG',
    'Profile Management': 'PROFILE',
    'Navigation': 'NAV',
    'Dashboard': 'DASH',
    'Forms': 'FORM',
    'CRUD Operations': 'CRUD',
    'Search': 'SEARCH',
    'Filters': 'FILTER',
    'Input Validation': 'VALIDATION',
    'Error Handling': 'ERROR',
    'Session Management': 'SESSION',
    'Notifications': 'NOTIF',
    'File Upload': 'FILE',
    'Offline Handling': 'OFFLINE',
    'Accessibility': 'A11Y',
    'Responsive UI': 'RESPONSIVE',
    'Performance Smoke Tests': 'PERF',
    'Regression Suite': 'REGR'
};
const moduleSizes = {
    'Authentication': 40,
    'Authorization': 30,
    'Registration': 20,
    'Profile Management': 20,
    'Navigation': 30,
    'Dashboard': 20,
    'Forms': 40,
    'CRUD Operations': 40,
    'Search': 20,
    'Filters': 20,
    'Input Validation': 40,
    'Error Handling': 20,
    'Session Management': 20,
    'Notifications': 20,
    'File Upload': 20,
    'Offline Handling': 10,
    'Accessibility': 20,
    'Responsive UI': 10,
    'Performance Smoke Tests': 20,
    'Regression Suite': 50
};
// Custom overrides for specific test cases requested or failed deliberately
const customTestCases = {
    'TC_AUTH_001': {
        name: 'Valid Login',
        priority: 'CRITICAL',
        preconditions: 'Application launched, user on Login screen, server reachable',
        steps: [
            '1. Type valid email "user@neurostay.com" in username field',
            '2. Type valid password "Neuro@12345" in password field',
            '3. Tap "Login" button'
        ],
        testData: 'email: user@neurostay.com, pass: Neuro@12345',
        expectedResult: 'User logged in successfully, JWT token stored, redirected to Dashboard page',
        status: 'PASSED'
    },
    'TC_AUTH_002': {
        name: 'Logout',
        priority: 'CRITICAL',
        preconditions: 'User is authenticated and currently on Dashboard/Profile',
        steps: [
            '1. Open sidebar menu or Profile tab',
            '2. Tap "Logout" button',
            '3. Confirm logout dialog'
        ],
        testData: 'N/A',
        expectedResult: 'User session terminated, credentials cleared, redirected to Login screen',
        status: 'PASSED'
    },
    'TC_AUTH_010': {
        name: 'Invalid OTP',
        priority: 'HIGH',
        preconditions: 'User has requested verification code on registration or password reset',
        steps: [
            '1. Navigate to verification screen',
            '2. Enter expired or incorrect OTP "999999"',
            '3. Tap "Verify"'
        ],
        testData: 'OTP: 999999 (Invalid)',
        expectedResult: 'Error display "Invalid OTP verification code, please try again"',
        status: 'FAILED',
        failureReason: 'OTP validation mismatch',
        stackTrace: 'Error: Expected error banner to show "Invalid OTP validation mismatch" but it was absent.\n   at LoginPage.verifyError (c:/projects/neurostay-ai/automation/pages/LoginPage.ts:42:12)\n   at testRunner.ts:182:25'
    },
    'TC_PROFILE_005': {
        name: 'Update Profile',
        priority: 'HIGH',
        preconditions: 'User authenticated, profile editing page loaded',
        steps: [
            '1. Edit Full Name field to "Dr. Neuro Tester"',
            '2. Tap "Save changes"',
            '3. Verify that changes are persisted'
        ],
        testData: 'name: Dr. Neuro Tester',
        expectedResult: 'Profile update api succeeds, local state refreshed with new profile details',
        status: 'PASSED'
    },
    'TC_SEARCH_003': {
        name: 'Search Existing Record',
        priority: 'HIGH',
        preconditions: 'Dashboard loaded, search interface active',
        steps: [
            '1. Type query "Cognitive Rehabilitation" in search box',
            '2. Press enter or tap magnifying glass icon',
            '3. Inspect the search results'
        ],
        testData: 'query: Cognitive Rehabilitation',
        expectedResult: 'Search results load with items matching "Cognitive Rehabilitation", count matches database records',
        status: 'PASSED'
    },
    'TC_FORM_008': {
        name: 'Mandatory Field Validation',
        priority: 'HIGH',
        preconditions: 'User on Profile edit screen',
        steps: [
            '1. Clear "Email Address" input field completely',
            '2. Tap "Save changes"',
            '3. Verify inline error visibility'
        ],
        testData: 'Email: [Empty]',
        expectedResult: 'Red validation text "Email is a mandatory field" is displayed below the field',
        status: 'FAILED',
        failureReason: 'Validation message missing',
        stackTrace: 'AssertionError: Expected element "#email-error" to be visible.\n   at ProfilePage.checkValidationMessage (c:/projects/neurostay-ai/automation/pages/ProfilePage.ts:74:35)\n   at testRunner.ts:241:19'
    },
    'TC_FILE_002': {
        name: 'Large File Upload',
        priority: 'MEDIUM',
        preconditions: 'User on Profile Picture edit section',
        steps: [
            '1. Tap avatar overlay and choose "Upload File"',
            '2. Select a 100MB dummy image file',
            '3. Tap upload and monitor memory'
        ],
        testData: 'File size: 100MB',
        expectedResult: 'System warns "File size exceeds limit (Max 5MB)" and blocks upload',
        status: 'FAILED',
        failureReason: 'Application crash',
        stackTrace: 'AppiumError: An unknown server-side error occurred while processing the command. Original error: Could not proxy command to the remote server. Associated process has exited due to java.lang.OutOfMemoryError.\n   at Driver.executeCommand (c:/projects/neurostay-ai/automation/node_modules/webdriverio/build/commands/index.js:52:10)'
    },
    'TC_NOTIFICATION_004': {
        name: 'Check push notifications',
        priority: 'MEDIUM',
        preconditions: 'Application launched on Android device supporting FCM',
        steps: [
            '1. Lock device screen',
            '2. Trigger remote cloud push notification',
            '3. Unlock device and verify system tray notification'
        ],
        testData: 'Push Payload: { title: "Daily Review" }',
        expectedResult: 'FCM push notification received and rendering in system status bar',
        status: 'SKIPPED',
        failureReason: 'Feature Disabled',
        stackTrace: 'SkippedReason: Notification module is disabled in app.json configuration for this specific release target.'
    }
};
// Generate more specific failures to show detailed report styling
const failTestIds = new Set([
    'TC_AUTH_010',
    'TC_FORM_008',
    'TC_FILE_002',
    'TC_VALIDATION_012',
    'TC_ERROR_003',
    'TC_OFFLINE_005',
    'TC_RESPONSIVE_002',
    'TC_PERF_007',
    'TC_A11Y_008',
    'TC_CRUD_018',
    'TC_NAV_022',
    'TC_AZ_014',
    'TC_SESSION_009'
]);
const skipTestIds = new Set([
    'TC_NOTIFICATION_004',
    'TC_REG_015',
    'TC_FILTER_011'
]);
function generateTestCases() {
    const list = [];
    Object.keys(moduleSizes).forEach(modName => {
        const size = moduleSizes[modName];
        const prefix = modulePrefixes[modName];
        for (let i = 1; i <= size; i++) {
            const id = `TC_${prefix}_${String(i).padStart(3, '0')}`;
            // Default values
            let priority = 'MEDIUM';
            if (i % 5 === 1)
                priority = 'CRITICAL';
            else if (i % 5 === 2 || i % 5 === 3)
                priority = 'HIGH';
            else if (i % 5 === 4)
                priority = 'LOW';
            let tc = {
                id,
                module: modName,
                name: `${modName} validation check - Scenario ${i}`,
                priority,
                preconditions: `Application installed. User signed in and on ${modName} target page.`,
                steps: [
                    `1. Navigate to ${modName} screen`,
                    `2. Perform action mapping to test scenario ${i}`,
                    `3. Verify screen elements render and respond correctly`
                ],
                testData: `Target index: ${i}, Priority level: ${priority}`,
                expectedResult: `Screen state transitions successfully without freezing, records matched in UI.`,
                actualResult: `Verification successful. Elements loaded.`,
                status: 'PASSED',
                executionTime: 0
            };
            // Apply custom overrides
            if (customTestCases[id]) {
                tc = { ...tc, ...customTestCases[id] };
            }
            else {
                // Automatically check if this ID is in the set of failures or skips
                if (failTestIds.has(id)) {
                    tc.status = 'FAILED';
                    tc.failureReason = `Failed to assert element loaded for scenario ${i}`;
                    tc.actualResult = `Failed. Timeout waiting for element visibility after 5000ms.`;
                    tc.stackTrace = `AssertionError: Expected locator target visible after 5000ms\n   at BasePage.waitForVisible (c:/projects/neurostay-ai/automation/pages/BasePage.ts:25:10)\n   at testRunner.ts:${100 + i}:14`;
                }
                else if (skipTestIds.has(id)) {
                    tc.status = 'SKIPPED';
                    tc.failureReason = 'Prerequisite module not enabled in current build flavor';
                    tc.actualResult = 'Skipped';
                    tc.stackTrace = 'SkippedReason: Bypassed by configuration. Feature flag is false.';
                }
            }
            list.push(tc);
        }
    });
    return list;
}
