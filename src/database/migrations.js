/**
 * WorkSphere Enterprise HRMS - Database Schema Migrations Runner
 * Layer: Database
 */

const db = require('./connection');
const schemaSql = require('./schema');
const logger = require('../core/Logger');

class SchemaMigrator {
  static async runMigrations() {
    logger.info('Starting Enterprise Database Schema Migration...');
    try {
      await db.exec(schemaSql);
      logger.info('Database Schema Migration completed successfully. All 35 relational tables created.');
      return true;
    } catch (err) {
      logger.error('Database migration failed', err);
      throw err;
    }
  }
}

module.exports = SchemaMigrator;
