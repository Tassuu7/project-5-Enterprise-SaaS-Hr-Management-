/**
 * WorkSphere Enterprise HRMS - EmployeeDocument Domain Model
 * Layer: Domain Models
 * Table: employee_documents
 */

class EmployeeDocument {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.employee_id = data.employee_id !== undefined ? data.employee_id : null;
    this.document_type = data.document_type !== undefined ? data.document_type : null;
    this.title = data.title !== undefined ? data.title : null;
    this.file_path = data.file_path !== undefined ? data.file_path : null;
    this.file_size_bytes = data.file_size_bytes !== undefined ? data.file_size_bytes : null;
    this.mime_type = data.mime_type !== undefined ? data.mime_type : null;
    this.requires_signature = data.requires_signature !== undefined ? data.requires_signature : null;
    this.is_signed = data.is_signed !== undefined ? data.is_signed : null;
    this.signed_at = data.signed_at !== undefined ? data.signed_at : null;
    this.expiry_date = data.expiry_date !== undefined ? data.expiry_date : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
  }

  static get tableName() {
    return 'employee_documents';
  }

  static get fields() {
    return ['id', 'tenant_id', 'employee_id', 'document_type', 'title', 'file_path', 'file_size_bytes', 'mime_type', 'requires_signature', 'is_signed', 'signed_at', 'expiry_date', 'created_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'employee_documents' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = EmployeeDocument;
