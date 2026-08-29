/**
 * WorkSphere Enterprise HRMS - OnboardingTask Domain Model
 * Layer: Domain Models
 * Table: onboarding_tasks
 */

class OnboardingTask {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.employee_id = data.employee_id !== undefined ? data.employee_id : null;
    this.task_name = data.task_name !== undefined ? data.task_name : null;
    this.category = data.category !== undefined ? data.category : null;
    this.assigned_to_role = data.assigned_to_role !== undefined ? data.assigned_to_role : null;
    this.due_days_from_joining = data.due_days_from_joining !== undefined ? data.due_days_from_joining : null;
    this.status = data.status !== undefined ? data.status : null;
    this.completed_at = data.completed_at !== undefined ? data.completed_at : null;
    this.notes = data.notes !== undefined ? data.notes : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
  }

  static get tableName() {
    return 'onboarding_tasks';
  }

  static get fields() {
    return ['id', 'tenant_id', 'employee_id', 'task_name', 'category', 'assigned_to_role', 'due_days_from_joining', 'status', 'completed_at', 'notes', 'created_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'onboarding_tasks' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = OnboardingTask;
