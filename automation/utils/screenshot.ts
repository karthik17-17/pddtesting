import { Browser } from 'webdriverio';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './logger';

export class ScreenshotUtility {
  private static screenshotDir = path.join(__dirname, '..', 'reports', 'Screenshots');

  private static initialize() {
    if (!fs.existsSync(ScreenshotUtility.screenshotDir)) {
      fs.mkdirSync(ScreenshotUtility.screenshotDir, { recursive: true });
    }
  }

  /**
   * Captures a real screenshot using the Appium driver, or writes a mock visual asset if in simulated execution.
   */
  public static async capture(driver?: Browser, testCaseId: string = 'unknown'): Promise<string> {
    ScreenshotUtility.initialize();
    const fileName = `${testCaseId}_${Date.now()}.png`;
    const fullPath = path.join(ScreenshotUtility.screenshotDir, fileName);

    if (driver) {
      try {
        Logger.info(`Capturing real device screenshot for ${testCaseId}...`);
        await driver.saveScreenshot(fullPath);
        Logger.info(`Screenshot saved to: ${fullPath}`);
        return `Screenshots/${fileName}`;
      } catch (err) {
        Logger.error(`Appium saveScreenshot failed: ${(err as Error).message}. Generating mock fallback.`);
      }
    }

    // Generate mock PNG fallback (a solid dark red square representing validation/assertion failure)
    try {
      // 1x1 transparent/red PNG base64 representation
      const mockPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAAI0lEQVR4nO3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAAAAAAPwGctMAAMtsVd0AAAAASUVORK5CYII=';
      fs.writeFileSync(fullPath, Buffer.from(mockPngBase64, 'base64'));
      Logger.info(`Mock screenshot written to: ${fullPath}`);
      return `Screenshots/${fileName}`;
    } catch (e) {
      Logger.error(`Failed to write mock screenshot: ${(e as Error).message}`);
      return '';
    }
  }
}
