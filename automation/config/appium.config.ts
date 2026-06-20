import * as path from 'path';

export const appiumCapabilities = {
  platformName: 'Android',
  'appium:deviceName': 'Android Emulator',
  'appium:automationName': 'UiAutomator2',
  'appium:app': path.join(__dirname, '..', '..', 'neurostay-mobile', 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk'),
  'appium:appPackage': 'com.anonymous.neurostaymobile',
  'appium:appActivity': '.MainActivity',
  'appium:noReset': false,
  'appium:fullReset': false,
  'appium:newCommandTimeout': 240
};

export const appiumConnection = {
  hostname: '127.0.0.1',
  port: 4723,
  path: '/',
  logLevel: 'warn' as const
};
