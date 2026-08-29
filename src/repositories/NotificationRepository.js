/**
 * WorkSphere Enterprise HRMS - NotificationRepository
 * Layer: Data Access Layer (DAL)
 */

const BaseRepository = require('./BaseRepository');
const db = require('../database/connection');

class NotificationRepository extends BaseRepository {
  constructor() {
    super('notifications', 'notif');
  }

  async findDetailed(filter = {}, options = {}) {
    let sql = `SELECT * FROM notifications`;
    const params = [];
    const keys = Object.keys(filter);
    if (keys.length > 0) {
      const whereClauses = keys.map((k) => `\${k.includes('.') ? k : 'notifications.' + k} = ?`).join(' AND ');
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

module.exports = new NotificationRepository();
