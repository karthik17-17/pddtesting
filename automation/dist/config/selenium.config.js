"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seleniumConnection = exports.seleniumCapabilities = void 0;
exports.seleniumCapabilities = {
    browserName: 'chrome',
    'goog:chromeOptions': {
        args: [
            '--headless',
            '--disable-gpu',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--window-size=1280,800'
        ]
    }
};
exports.seleniumConnection = {
    logLevel: 'error',
    capabilities: exports.seleniumCapabilities
};
