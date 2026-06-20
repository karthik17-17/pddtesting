import { Browser } from 'webdriverio';
import { Logger } from '../utils/logger';

export class BasePage {
  protected driver?: Browser;

  constructor(driver?: Browser) {
    this.driver = driver;
  }

  protected async getElement(selector: string) {
    if (!this.driver) {
      throw new Error('WebDriverIO Browser instance is not initialized in BasePage.');
    }
    return this.driver.$(selector);
  }

  public async click(selector: string, elementName: string): Promise<void> {
    Logger.info(`Tapping on element: ${elementName} (${selector})`);
    if (this.driver) {
      const el = await this.getElement(selector);
      await el.waitForDisplayed({ timeout: 5000 });
      await el.click();
    }
  }

  public async type(selector: string, text: string, elementName: string): Promise<void> {
    Logger.info(`Typing "${text.replace(/./g, '*')}" into: ${elementName} (${selector})`);
    if (this.driver) {
      const el = await this.getElement(selector);
      await el.waitForDisplayed({ timeout: 5000 });
      await el.setValue(text);
    }
  }

  public async getText(selector: string, elementName: string): Promise<string> {
    Logger.info(`Retrieving text from element: ${elementName} (${selector})`);
    if (this.driver) {
      const el = await this.getElement(selector);
      await el.waitForDisplayed({ timeout: 5000 });
      return await el.getText();
    }
    return 'Mocked Text';
  }

  public async isDisplayed(selector: string, elementName: string): Promise<boolean> {
    Logger.info(`Checking display status of: ${elementName} (${selector})`);
    if (this.driver) {
      try {
        const el = await this.getElement(selector);
        return await el.isDisplayed();
      } catch (err) {
        return false;
      }
    }
    return true;
  }

  public async pause(ms: number): Promise<void> {
    Logger.info(`Pausing for ${ms}ms`);
    if (this.driver) {
      await this.driver.pause(ms);
    } else {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }
}
