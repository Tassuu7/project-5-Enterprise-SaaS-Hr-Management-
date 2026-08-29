/**
 * WorkSphere Enterprise HRMS - ApplicationRepository
 * Layer: Data Access Layer (DAL)
 */

const BaseRepository = require('./BaseRepository');
const db = require('../database/connection');

class ApplicationRepository extends BaseRepository {
  constructor() {
    super('job_applications', 'app');
  }

  async findDetailed(filter = {}, options = {}) {
    let sql = `SELECT a.*, c.first_name, c.last_name, c.email, j.title as job_title FROM job_applications a JOIN candidates c ON a.candidate_id = c.id JOIN job_postings j ON a.job_posting_id = j.id`;
    const params = [];
    const keys = Object.keys(filter);
    if (keys.length > 0) {
      const whereClauses = keys.map((k) => `\${k.includes('.') ? k : 'job_applications.' + k} = ?`).join(' AND ');
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

module.exports = new ApplicationRepository();
