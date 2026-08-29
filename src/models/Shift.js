/**
 * WorkSphere Enterprise HRMS - Shift Domain Model
 * Layer: Domain Models
 * Table: shifts
 */

class Shift {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.name = data.name !== undefined ? data.name : null;
    this.start_time = data.start_time !== undefined ? data.start_time : null;
    this.end_time = data.end_time !== undefined ? data.end_time : null;
    this.grace_period_minutes = data.grace_period_minutes !== undefined ? data.grace_period_minutes : null;
    this.half_day_hours = data.half_day_hours !== undefined ? data.half_day_hours : null;
    this.full_day_hours = data.full_day_hours !== undefined ? data.full_day_hours : null;
    this.is_night_shift = data.is_night_shift !== undefined ? data.is_night_shift : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
  }

  static get tableName() {
    return 'shifts';
  }

  static get fields() {
    return ['id', 'tenant_id', 'name', 'start_time', 'end_time', 'grace_period_minutes', 'half_day_hours', 'full_day_hours', 'is_night_shift', 'created_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'shifts' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = Shift;
