/**
 * WorkSphere Enterprise HRMS - GoalRepository
 * Layer: Data Access Layer (DAL)
 */

const BaseRepository = require('./BaseRepository');
const db = require('../database/connection');

class GoalRepository extends BaseRepository {
  constructor() {
    super('goals', 'g');
  }

  async findDetailed(filter = {}, options = {}) {
    let sql = `SELECT g.*, e.first_name, e.last_name FROM goals g JOIN employees e ON g.employee_id = e.id`;
    const params = [];
    const keys = Object.keys(filter);
    if (keys.length > 0) {
      const whereClauses = keys.map((k) => (k.includes('.') ? k : 'g.' + k) + ' = ?').join(' AND ');
      sql += (sql.includes('WHERE') ? ' AND ' : ' WHERE ') + whereClauses;
      params.push(...Object.values(filter));
    }
    if (options.orderBy) {
      const dir = options.orderDirection === 'DESC' ? 'DESC' : 'ASC';
      sql += ' ORDER BY ' + options.orderBy + ' ' + dir;
    }
    if (options.limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(options.limit, 10));
      if (options.offset) {
        sql += ' OFFSET ?';
        params.push(parseInt(options.offset, 10));
      }
    }
    return db.all(sql, params);
  }
}

module.exports = new GoalRepository();
