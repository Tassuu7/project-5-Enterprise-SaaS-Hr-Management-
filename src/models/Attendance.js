/**
 * WorkSphere Enterprise HRMS - Attendance Domain Model
 * Layer: Domain Models
 * Table: attendances
 */

class Attendance {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.employee_id = data.employee_id !== undefined ? data.employee_id : null;
    this.shift_id = data.shift_id !== undefined ? data.shift_id : null;
    this.date = data.date !== undefined ? data.date : null;
    this.punch_in_time = data.punch_in_time !== undefined ? data.punch_in_time : null;
    this.punch_out_time = data.punch_out_time !== undefined ? data.punch_out_time : null;
    this.punch_in_ip = data.punch_in_ip !== undefined ? data.punch_in_ip : null;
    this.punch_out_ip = data.punch_out_ip !== undefined ? data.punch_out_ip : null;
    this.total_work_hours = data.total_work_hours !== undefined ? data.total_work_hours : null;
    this.break_duration_minutes = data.break_duration_minutes !== undefined ? data.break_duration_minutes : null;
    this.overtime_hours = data.overtime_hours !== undefined ? data.overtime_hours : null;
    this.status = data.status !== undefined ? data.status : null;
    this.is_late = data.is_late !== undefined ? data.is_late : null;
    this.late_by_minutes = data.late_by_minutes !== undefined ? data.late_by_minutes : null;
    this.is_early_leaving = data.is_early_leaving !== undefined ? data.is_early_leaving : null;
    this.notes = data.notes !== undefined ? data.notes : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
    this.updated_at = data.updated_at !== undefined ? data.updated_at : null;
  }

  static get tableName() {
    return 'attendances';
  }

  static get fields() {
    return ['id', 'tenant_id', 'employee_id', 'shift_id', 'date', 'punch_in_time', 'punch_out_time', 'punch_in_ip', 'punch_out_ip', 'total_work_hours', 'break_duration_minutes', 'overtime_hours', 'status', 'is_late', 'late_by_minutes', 'is_early_leaving', 'notes', 'created_at', 'updated_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'attendances' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = Attendance;
