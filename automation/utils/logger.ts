import * as fs from 'fs';
import * as path from 'path';

export class Logger {
  private static logDir = path.join(__dirname, '..', 'reports', 'Logs');
  private static logFilePath = path.join(Logger.logDir, 'selenium-execution.log');

  private static initialize() {
    if (!fs.existsSync(Logger.logDir)) {
      fs.mkdirSync(Logger.logDir, { recursive: true });
    }
  }

  private static log(prefix: string, message: string) {
    Logger.initialize();
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${prefix}: ${message}\n`;

    // Console output
    if (prefix === 'ERROR') {
      console.error(`\x1b[31m${logLine.trim()}\x1b[0m`);
    } else if (prefix === 'WARN') {
      console.warn(`\x1b[33m${logLine.trim()}\x1b[0m`);
    } else {
      console.log(logLine.trim());
    }

    // File write
    try {
      fs.appendFileSync(Logger.logFilePath, logLine, 'utf8');
    } catch (e) {
      console.error(`Failed to write to log file: ${(e as Error).message}`);
    }
  }

  public static info(message: string) {
    Logger.log('INFO', message);
  }

  public static warn(message: string) {
    Logger.log('WARN', message);
  }

  public static error(message: string) {
    Logger.log('ERROR', message);
  }

  public static clearLogs() {
    Logger.initialize();
    try {
      if (fs.existsSync(Logger.logFilePath)) {
        fs.writeFileSync(Logger.logFilePath, '', 'utf8');
      }
    } catch (e) {
      console.error(`Failed to clear log file: ${(e as Error).message}`);
    }
  }
}
