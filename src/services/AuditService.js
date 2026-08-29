/**
 * WorkSphere Enterprise HRMS - Security Audit Trail & Event Logging Service
 * Layer: Business Logic (Services)
 */

const auditRepository = require('../repositories/AuditRepository');
const db = require('../database/connection');

class AuditService {
  async logAction(action, entityType, entityId, meta = {}, tenantId = 'org_tenant_enterprise_001') {
    try {
      return await auditRepository.create({
        tenant_id: tenantId,
        user_id: meta.userId || null,
        action,
        entity_type: entityType,
        entity_id: entityId,
        old_values_json: meta.oldValues ? JSON.stringify(meta.oldValues) : null,
        new_values_json: meta.newValues ? JSON.stringify(meta.newValues) : null,
        ip_address: meta.ipAddress || '127.0.0.1',
        user_agent: meta.userAgent || 'Enterprise Client',
      });
    } catch (e) {
      // Never crash core flow on audit failure
    }
  }

  async getAuditTrail(filter = {}, options = {}) {
    return auditRepository.findDetailed(filter, options);
  }
}

module.exports = new AuditService();
