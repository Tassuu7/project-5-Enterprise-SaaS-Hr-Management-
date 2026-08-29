/**
 * WorkSphere Enterprise HRMS - PerformanceReview Domain Model
 * Layer: Domain Models
 * Table: performance_reviews
 */

class PerformanceReview {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.appraisal_cycle_id = data.appraisal_cycle_id !== undefined ? data.appraisal_cycle_id : null;
    this.employee_id = data.employee_id !== undefined ? data.employee_id : null;
    this.reviewer_id = data.reviewer_id !== undefined ? data.reviewer_id : null;
    this.review_type = data.review_type !== undefined ? data.review_type : null;
    this.self_rating = data.self_rating !== undefined ? data.self_rating : null;
    this.self_comments = data.self_comments !== undefined ? data.self_comments : null;
    this.reviewer_rating = data.reviewer_rating !== undefined ? data.reviewer_rating : null;
    this.reviewer_comments = data.reviewer_comments !== undefined ? data.reviewer_comments : null;
    this.final_rating = data.final_rating !== undefined ? data.final_rating : null;
    this.potential_rating = data.potential_rating !== undefined ? data.potential_rating : null;
    this.nine_box_quadrant = data.nine_box_quadrant !== undefined ? data.nine_box_quadrant : null;
    this.status = data.status !== undefined ? data.status : null;
    this.submitted_at = data.submitted_at !== undefined ? data.submitted_at : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
    this.updated_at = data.updated_at !== undefined ? data.updated_at : null;
  }

  static get tableName() {
    return 'performance_reviews';
  }

  static get fields() {
    return ['id', 'tenant_id', 'appraisal_cycle_id', 'employee_id', 'reviewer_id', 'review_type', 'self_rating', 'self_comments', 'reviewer_rating', 'reviewer_comments', 'final_rating', 'potential_rating', 'nine_box_quadrant', 'status', 'submitted_at', 'created_at', 'updated_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'performance_reviews' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = PerformanceReview;
