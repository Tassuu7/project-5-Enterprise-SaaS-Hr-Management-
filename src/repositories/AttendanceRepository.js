/**
 * WorkSphere Enterprise HRMS - AttendanceRepository
 * Layer: Data Access Layer (DAL)
 */

const BaseRepository = require('./BaseRepository');
const db = require('../database/connection');

class AttendanceRepository extends BaseRepository {
  constructor() {
    super('attendances', 'a');
  }

  async findDetailed(filter = {}, options = {}) {
    let sql = `SELECT a.*, e.first_name, e.last_name, e.employee_code, d.name as department_name FROM attendances a JOIN employees e ON a.employee_id = e.id LEFT JOIN departments d ON e.department_id = d.id`;
    const params = [];
    const keys = Object.keys(filter);
    if (keys.length > 0) {
      const whereClauses = keys.map((k) => (k.includes('.') ? k : 'a.' + k) + ' = ?').join(' AND ');
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

module.exports = new AttendanceRepository();
