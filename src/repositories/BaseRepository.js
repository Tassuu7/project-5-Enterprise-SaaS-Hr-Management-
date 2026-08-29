/**
 * WorkSphere Enterprise HRMS - Base Generic Repository Pattern
 * Layer: Data Access Layer (DAL)
 */

const db = require('../database/connection');
const logger = require('../core/Logger');
const { NotFoundError } = require('../core/AppError');

class BaseRepository {
  constructor(tableName, idPrefix = 'id_') {
    this.tableName = tableName;
    this.idPrefix = idPrefix;
  }

  async findById(id, tenantId = null) {
    let sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const params = [id];
    if (tenantId && this.tableName !== 'tenants') {
      sql += ' AND tenant_id = ?';
      params.push(tenantId);
    }
    return db.get(sql, params);
  }

  async findOne(filter = {}) {
    const keys = Object.keys(filter);
    if (keys.length === 0) return null;
    const whereClauses = keys.map((k) => `${k} = ?`).join(' AND ');
    const params = Object.values(filter);
    const sql = `SELECT * FROM ${this.tableName} WHERE ${whereClauses} LIMIT 1`;
    return db.get(sql, params);
  }

  async findMany(filter = {}, options = {}) {
    let sql = `SELECT * FROM ${this.tableName}`;
    const params = [];
    const keys = Object.keys(filter);

    if (keys.length > 0) {
      const whereClauses = keys.map((k) => `${k} = ?`).join(' AND ');
      sql += ` WHERE ${whereClauses}`;
      params.push(...Object.values(filter));
    }

    if (options.orderBy) {
      const direction = options.orderDirection === 'DESC' ? 'DESC' : 'ASC';
      sql += ` ORDER BY ${options.orderBy} ${direction}`;
    }

    if (options.limit) {
      sql += ` LIMIT ?`;
      params.push(parseInt(options.limit, 10));
      if (options.offset) {
        sql += ` OFFSET ?`;
        params.push(parseInt(options.offset, 10));
      }
    }

    return db.all(sql, params);
  }

  async count(filter = {}) {
    let sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    const params = [];
    const keys = Object.keys(filter);
    if (keys.length > 0) {
      const whereClauses = keys.map((k) => `${k} = ?`).join(' AND ');
      sql += ` WHERE ${whereClauses}`;
      params.push(...Object.values(filter));
    }
    const row = await db.get(sql, params);
    return row ? row.count : 0;
  }

  async create(data) {
    if (!data.id) {
      data.id = `${this.idPrefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }
    const keys = Object.keys(data);
    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
    const params = Object.values(data);
    await db.run(sql, params);
    return data;
  }

  async update(id, data, tenantId = null) {
    const keys = Object.keys(data).filter((k) => k !== 'id');
    if (keys.length === 0) return null;
    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    let sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
    const params = [...keys.map((k) => data[k]), id];

    if (tenantId && this.tableName !== 'tenants') {
      sql += ' AND tenant_id = ?';
      params.push(tenantId);
    }

    const res = await db.run(sql, params);
    if (res.changes === 0) {
      throw new NotFoundError(this.tableName, id);
    }
    return this.findById(id, tenantId);
  }

  async delete(id, tenantId = null) {
    let sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const params = [id];
    if (tenantId && this.tableName !== 'tenants') {
      sql += ' AND tenant_id = ?';
      params.push(tenantId);
    }
    const res = await db.run(sql, params);
    return res.changes > 0;
  }
}

module.exports = BaseRepository;
