export const seleniumCapabilities = {
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

export const seleniumConnection = {
  logLevel: 'error' as const,
  capabilities: seleniumCapabilities
};
