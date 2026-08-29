/**
 * WorkSphere Enterprise HRMS - Centralized Enterprise Logger
 * Layer: Core
 */

const fs = require('fs');
const path = require('path');

class EnterpriseLogger {
  constructor() {
    this.logDir = path.resolve(__dirname, '../../storage/logs');
    if (!fs.existsSync(this.logDir)) {
      try {
        fs.mkdirSync(this.logDir, { recursive: true });
      } catch (e) {
        // Fallback
      }
    }
    this.levels = {
      DEBUG: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3,
    };
    this.currentLevel = process.env.NODE_ENV === 'production' ? this.levels.INFO : this.levels.DEBUG;
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
  }

  writeLog(level, formattedMsg) {
    console.log(formattedMsg);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const logFile = path.join(this.logDir, `worksphere-${today}.log`);
      fs.appendFileSync(logFile, formattedMsg + '\n', 'utf8');
    } catch (err) {
      // Non-blocking log failure
    }
  }

  debug(message, meta = {}) {
    if (this.currentLevel <= this.levels.DEBUG) {
      this.writeLog('DEBUG', this.formatMessage('DEBUG', message, meta));
    }
  }

  info(message, meta = {}) {
    if (this.currentLevel <= this.levels.INFO) {
      this.writeLog('INFO', this.formatMessage('INFO', message, meta));
    }
  }

  warn(message, meta = {}) {
    if (this.currentLevel <= this.levels.WARN) {
      this.writeLog('WARN', this.formatMessage('WARN', message, meta));
    }
  }

  error(message, errorOrMeta = {}) {
    const meta = errorOrMeta instanceof Error ? { stack: errorOrMeta.stack, msg: errorOrMeta.message } : errorOrMeta;
    this.writeLog('ERROR', this.formatMessage('ERROR', message, meta));
  }
}

module.exports = new EnterpriseLogger();
