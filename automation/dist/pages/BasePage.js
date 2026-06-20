"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePage = void 0;
const logger_1 = require("../utils/logger");
class BasePage {
    driver;
    constructor(driver) {
        this.driver = driver;
    }
    async getElement(selector) {
        if (!this.driver) {
            throw new Error('WebDriverIO Browser instance is not initialized in BasePage.');
        }
        return this.driver.$(selector);
    }
    async click(selector, elementName) {
        logger_1.Logger.info(`Tapping on element: ${elementName} (${selector})`);
        if (this.driver) {
            const el = await this.getElement(selector);
            await el.waitForDisplayed({ timeout: 5000 });
            await el.click();
        }
    }
    async type(selector, text, elementName) {
        logger_1.Logger.info(`Typing "${text.replace(/./g, '*')}" into: ${elementName} (${selector})`);
        if (this.driver) {
            const el = await this.getElement(selector);
            await el.waitForDisplayed({ timeout: 5000 });
            await el.setValue(text);
        }
    }
    async getText(selector, elementName) {
        logger_1.Logger.info(`Retrieving text from element: ${elementName} (${selector})`);
        if (this.driver) {
            const el = await this.getElement(selector);
            await el.waitForDisplayed({ timeout: 5000 });
            return await el.getText();
        }
        return 'Mocked Text';
    }
    async isDisplayed(selector, elementName) {
        logger_1.Logger.info(`Checking display status of: ${elementName} (${selector})`);
        if (this.driver) {
            try {
                const el = await this.getElement(selector);
                return await el.isDisplayed();
            }
            catch (err) {
                return false;
            }
        }
        return true;
    }
    async pause(ms) {
        logger_1.Logger.info(`Pausing for ${ms}ms`);
        if (this.driver) {
            await this.driver.pause(ms);
        }
        else {
            await new Promise(resolve => setTimeout(resolve, ms));
        }
    }
}
exports.BasePage = BasePage;
