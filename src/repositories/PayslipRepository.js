/**
 * WorkSphere Enterprise HRMS - PayslipRepository
 * Layer: Data Access Layer (DAL)
 */

const BaseRepository = require('./BaseRepository');
const db = require('../database/connection');

class PayslipRepository extends BaseRepository {
  constructor() {
    super('payslips', 'pslip');
  }

  async findDetailed(filter = {}, options = {}) {
    let sql = `SELECT p.*, e.first_name, e.last_name, e.employee_code, d.name as department_name FROM payslips p JOIN employees e ON p.employee_id = e.id LEFT JOIN departments d ON e.department_id = d.id`;
    const params = [];
    const keys = Object.keys(filter);
    if (keys.length > 0) {
      const whereClauses = keys.map((k) => `\${k.includes('.') ? k : 'payslips.' + k} = ?`).join(' AND ');
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

module.exports = new PayslipRepository();
