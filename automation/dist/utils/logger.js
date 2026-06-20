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
exports.Logger = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class Logger {
    static logDir = path.join(__dirname, '..', 'reports', 'Logs');
    static logFilePath = path.join(Logger.logDir, 'selenium-execution.log');
    static initialize() {
        if (!fs.existsSync(Logger.logDir)) {
            fs.mkdirSync(Logger.logDir, { recursive: true });
        }
    }
    static log(prefix, message) {
        Logger.initialize();
        const timestamp = new Date().toISOString();
        const logLine = `[${timestamp}] ${prefix}: ${message}\n`;
        // Console output
        if (prefix === 'ERROR') {
            console.error(`\x1b[31m${logLine.trim()}\x1b[0m`);
        }
        else if (prefix === 'WARN') {
            console.warn(`\x1b[33m${logLine.trim()}\x1b[0m`);
        }
        else {
            console.log(logLine.trim());
        }
        // File write
        try {
            fs.appendFileSync(Logger.logFilePath, logLine, 'utf8');
        }
        catch (e) {
            console.error(`Failed to write to log file: ${e.message}`);
        }
    }
    static info(message) {
        Logger.log('INFO', message);
    }
    static warn(message) {
        Logger.log('WARN', message);
    }
    static error(message) {
        Logger.log('ERROR', message);
    }
    static clearLogs() {
        Logger.initialize();
        try {
            if (fs.existsSync(Logger.logFilePath)) {
                fs.writeFileSync(Logger.logFilePath, '', 'utf8');
            }
        }
        catch (e) {
            console.error(`Failed to clear log file: ${e.message}`);
        }
    }
}
exports.Logger = Logger;
