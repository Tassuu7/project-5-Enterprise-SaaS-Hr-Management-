/**
 * WorkSphere Enterprise HRMS - DocumentRepository
 * Layer: Data Access Layer (DAL)
 */

const BaseRepository = require('./BaseRepository');
const db = require('../database/connection');

class DocumentRepository extends BaseRepository {
  constructor() {
    super('employee_documents', 'doc');
  }

  async findDetailed(filter = {}, options = {}) {
    let sql = `SELECT ed.*, e.first_name, e.last_name FROM employee_documents ed JOIN employees e ON ed.employee_id = e.id`;
    const params = [];
    const keys = Object.keys(filter);
    if (keys.length > 0) {
      const whereClauses = keys.map((k) => `\${k.includes('.') ? k : 'employee_documents.' + k} = ?`).join(' AND ');
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

module.exports = new DocumentRepository();
