/**
 * WorkSphere Enterprise HRMS - PerformanceReviewRepository
 * Layer: Data Access Layer (DAL)
 */

const BaseRepository = require('./BaseRepository');
const db = require('../database/connection');

class PerformanceReviewRepository extends BaseRepository {
  constructor() {
    super('performance_reviews', 'prev');
  }

  async findDetailed(filter = {}, options = {}) {
    let sql = `SELECT pr.*, e.first_name as employee_first_name, e.last_name as employee_last_name, r.first_name as reviewer_first_name, r.last_name as reviewer_last_name FROM performance_reviews pr JOIN employees e ON pr.employee_id = e.id JOIN employees r ON pr.reviewer_id = r.id`;
    const params = [];
    const keys = Object.keys(filter);
    if (keys.length > 0) {
      const whereClauses = keys.map((k) => `\${k.includes('.') ? k : 'performance_reviews.' + k} = ?`).join(' AND ');
      sql += (sql.includes('WHERE') ? ' AND ' : ' WHERE ') + whereClauses;
      params.push(...Object.values(filter));
    }
    if (options.orderBy) {
      sql += ` ORDER BY \${options.orderBy} \${options.orderDirection === 'DESC' ? 'DESC' : 'ASC'}`;
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
}

module.exports = new PerformanceReviewRepository();
