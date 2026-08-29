/**
 * WorkSphere Enterprise HRMS - Enterprise Database Connection & Query Engine
 * Layer: Database
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const appConfig = require('../config/app.config');
const logger = require('../core/Logger');

class DatabaseConnection {
  constructor() {
    this.db = null;
    this.init();
  }

  init() {
    const dbPath = appConfig.database.storage;
    const storageDir = path.dirname(dbPath);
    if (!fs.existsSync(storageDir)) {
      try {
        fs.mkdirSync(storageDir, { recursive: true });
      } catch (err) {
        logger.error('Failed to create database storage directory', err);
      }
    }

    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        logger.error(`Database connection error for ${dbPath}:`, err);
      } else {
        logger.info(`SQLite Database connected successfully at ${dbPath}`);
        this.configurePragmas();
      }
    });
  }

  configurePragmas() {
    this.db.run('PRAGMA foreign_keys = ON;');
    this.db.run('PRAGMA journal_mode = WAL;');
    this.db.run('PRAGMA synchronous = NORMAL;');
    this.db.run('PRAGMA busy_timeout = 5000;');
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          logger.error(`DB Run Error: ${sql}`, { err, params });
          reject(err);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          logger.error(`DB Get Error: ${sql}`, { err, params });
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          logger.error(`DB All Error: ${sql}`, { err, params });
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  async exec(sql) {
    return new Promise((resolve, reject) => {
      this.db.exec(sql, (err) => {
        if (err) {
          logger.error('DB Exec Error', err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  async close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

module.exports = new DatabaseConnection();
