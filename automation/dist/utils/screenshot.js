"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenshotUtility = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const logger_1 = require("./logger");
class ScreenshotUtility {
    static screenshotDir = path.join(__dirname, '..', 'reports', 'Screenshots');
    static initialize() {
        if (!fs.existsSync(ScreenshotUtility.screenshotDir)) {
            fs.mkdirSync(ScreenshotUtility.screenshotDir, { recursive: true });
        }
    }
    /**
     * Captures a real screenshot using the Appium driver, or writes a mock visual asset if in simulated execution.
     */
    static async capture(driver, testCaseId = 'unknown') {
        ScreenshotUtility.initialize();
        const fileName = `${testCaseId}_${Date.now()}.png`;
        const fullPath = path.join(ScreenshotUtility.screenshotDir, fileName);
        if (driver) {
            try {
                logger_1.Logger.info(`Capturing real device screenshot for ${testCaseId}...`);
                await driver.saveScreenshot(fullPath);
                logger_1.Logger.info(`Screenshot saved to: ${fullPath}`);
                return `Screenshots/${fileName}`;
            }
            catch (err) {
                logger_1.Logger.error(`Appium saveScreenshot failed: ${err.message}. Generating mock fallback.`);
            }
        }
        // Generate mock PNG fallback (a solid dark red square representing validation/assertion failure)
        try {
            // 1x1 transparent/red PNG base64 representation
            const mockPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAAI0lEQVR4nO3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAAAAAAPwGctMAAMtsVd0AAAAASUVORK5CYII=';
            fs.writeFileSync(fullPath, Buffer.from(mockPngBase64, 'base64'));
            logger_1.Logger.info(`Mock screenshot written to: ${fullPath}`);
            return `Screenshots/${fileName}`;
        }
        catch (e) {
            logger_1.Logger.error(`Failed to write mock screenshot: ${e.message}`);
            return '';
        }
    }
}
exports.ScreenshotUtility = ScreenshotUtility;
