/**
 * WorkSphere Enterprise HRMS - HelpdeskTicket Domain Model
 * Layer: Domain Models
 * Table: helpdesk_tickets
 */

class HelpdeskTicket {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.ticket_number = data.ticket_number !== undefined ? data.ticket_number : null;
    this.employee_id = data.employee_id !== undefined ? data.employee_id : null;
    this.category = data.category !== undefined ? data.category : null;
    this.subject = data.subject !== undefined ? data.subject : null;
    this.description = data.description !== undefined ? data.description : null;
    this.priority = data.priority !== undefined ? data.priority : null;
    this.status = data.status !== undefined ? data.status : null;
    this.assigned_to = data.assigned_to !== undefined ? data.assigned_to : null;
    this.resolved_at = data.resolved_at !== undefined ? data.resolved_at : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
    this.updated_at = data.updated_at !== undefined ? data.updated_at : null;
  }

  static get tableName() {
    return 'helpdesk_tickets';
  }

  static get fields() {
    return ['id', 'tenant_id', 'ticket_number', 'employee_id', 'category', 'subject', 'description', 'priority', 'status', 'assigned_to', 'resolved_at', 'created_at', 'updated_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'helpdesk_tickets' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = HelpdeskTicket;
