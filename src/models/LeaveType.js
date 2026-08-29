/**
 * WorkSphere Enterprise HRMS - LeaveType Domain Model
 * Layer: Domain Models
 * Table: leave_types
 */

class LeaveType {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.name = data.name !== undefined ? data.name : null;
    this.code = data.code !== undefined ? data.code : null;
    this.description = data.description !== undefined ? data.description : null;
    this.days_per_year = data.days_per_year !== undefined ? data.days_per_year : null;
    this.is_paid = data.is_paid !== undefined ? data.is_paid : null;
    this.is_carry_forward = data.is_carry_forward !== undefined ? data.is_carry_forward : null;
    this.max_carry_forward_days = data.max_carry_forward_days !== undefined ? data.max_carry_forward_days : null;
    this.requires_attachment = data.requires_attachment !== undefined ? data.requires_attachment : null;
    this.gender_restriction = data.gender_restriction !== undefined ? data.gender_restriction : null;
    this.is_active = data.is_active !== undefined ? data.is_active : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
  }

  static get tableName() {
    return 'leave_types';
  }

  static get fields() {
    return ['id', 'tenant_id', 'name', 'code', 'description', 'days_per_year', 'is_paid', 'is_carry_forward', 'max_carry_forward_days', 'requires_attachment', 'gender_restriction', 'is_active', 'created_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'leave_types' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = LeaveType;
