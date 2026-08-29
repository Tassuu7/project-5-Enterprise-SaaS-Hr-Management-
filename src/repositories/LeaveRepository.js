/**
 * WorkSphere Enterprise HRMS - LeaveRepository
 * Layer: Data Access Layer (DAL)
 */

const BaseRepository = require('./BaseRepository');
const db = require('../database/connection');

class LeaveRepository extends BaseRepository {
  constructor() {
    super('leave_requests', 'lvrq');
  }

  async findDetailed(filter = {}, options = {}) {
    let sql = `SELECT lr.*, lt.name as leave_type_name, e.first_name, e.last_name FROM leave_requests lr JOIN leave_types lt ON lr.leave_type_id = lt.id JOIN employees e ON lr.employee_id = e.id`;
    const params = [];
    const keys = Object.keys(filter);
    if (keys.length > 0) {
      const whereClauses = keys.map((k) => `\${k.includes('.') ? k : 'leave_requests.' + k} = ?`).join(' AND ');
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

module.exports = new LeaveRepository();
