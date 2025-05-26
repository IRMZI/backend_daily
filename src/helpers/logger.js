import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFilePath = path.join(logDir, 'app.log');

const log = (level, message) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level: level.toUpperCase(),
    message
  };
  const logMessage = JSON.stringify(logEntry, null, 2) + '\n'; // Pretty print JSON

  // Read the existing log file content
  let existingLogs = '';
  if (fs.existsSync(logFilePath)) {
    existingLogs = fs.readFileSync(logFilePath, 'utf8');
  }

  // Prepend the new log message
  const updatedLogs = logMessage + existingLogs;
  fs.writeFileSync(logFilePath, updatedLogs);
};

export const debug = (message) => log('debug', message);
export const info = (message) => log('info', message);
export const warn = (message) => log('warn', message);
export const error = (message) => log('error', message);
