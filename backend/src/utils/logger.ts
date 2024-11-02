import { createLogger, format, transports } from 'winston';
import path from 'path';
import fs from 'fs';
import os from 'os';

const logDirectory = os.platform() === 'linux'
  ? path.join('/home/ubuntu/digital-closet/backend/node/src/utils/logs')
  : path.join(__dirname, 'logs');
const logFile = path.join(logDirectory, 'app.log');

if (!fs.existsSync(logDirectory)) {
  console.log('Log directory does not exist, creating one...');
  fs.mkdirSync(logDirectory, { recursive: true }); 
}

if (!fs.existsSync(logFile)) {
  console.log('Log file does not exist, creating one...');
  fs.writeFileSync(logFile, ''); 
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(), 
    format.json(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new transports.File({ 
      filename: logFile, 
      options: { flags: 'a' }, 
    }),
  ],
});
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    ),
  }));

export default logger;
