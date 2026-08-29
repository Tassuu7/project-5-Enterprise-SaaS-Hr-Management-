/**
 * WorkSphere Enterprise HRMS - OKRs, 360 Reviews & 9-Box Talent Matrix
 * Layer: Business Logic (Services)
 */

const performanceReviewRepository = require('../repositories/PerformanceReviewRepository');
const goalRepository = require('../repositories/GoalRepository');
const db = require('../database/connection');
const matrixCalculator = require('../utils/matrixCalculator');
const { ValidationError, NotFoundError } = require('../core/AppError');
const logger = require('../core/Logger');
const eventBus = require('../core/EventBus');

class PerformanceService {
  async getEmployeeGoals(employeeId) {
    const goals = await goalRepository.findMany({ employee_id: employeeId }, { orderBy: 'created_at DESC' });
    for (const g of goals) {
      g.keyResults = await db.all('SELECT * FROM key_results WHERE goal_id = ?', [g.id]);
    }
    return goals;
  }

  async createGoal(data, tenantId = 'org_tenant_enterprise_001') {
    const goal = await goalRepository.create({
      tenant_id: tenantId,
      employee_id: data.employeeId,
      appraisal_cycle_id: data.appraisalCycleId || null,
      title: data.title,
      description: data.description || '',
      category: data.category || 'OPERATIONAL',
      weightage: data.weightage || 25,
      progress_percentage: 0,
      status: 'IN_PROGRESS',
      due_date: data.dueDate || null,
    });

    if (data.keyResults && Array.isArray(data.keyResults)) {
      for (const kr of data.keyResults) {
        await db.run(
          `INSERT INTO key_results (id, goal_id, title, target_value, current_value, metric_unit, progress_percentage)
           VALUES (?, ?, ?, ?, ?, ?, 0)`,
          [`kr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, goal.id, kr.title, kr.targetValue || 100, 0, kr.metricUnit || '%']
        );
      }
    }

    return goal;
  }

  async submitReview(reviewId, reviewData) {
    const review = await performanceReviewRepository.findById(reviewId);
    if (!review) throw new NotFoundError('PerformanceReview', reviewId);

    const perfRating = reviewData.reviewerRating || review.reviewer_rating || 3;
    const potRating = reviewData.potentialRating || review.potential_rating || 3;
    const nineBoxCategory = matrixCalculator.classifyNineBox(perfRating, potRating);

    const finalScore = (perfRating * 0.7) + (potRating * 0.3);

    const updated = await performanceReviewRepository.update(reviewId, {
      reviewer_rating: perfRating,
      reviewer_comments: reviewData.reviewerComments || review.reviewer_comments,
      potential_rating: potRating,
      final_rating: parseFloat(finalScore.toFixed(2)),
      nine_box_quadrant: nineBoxCategory.code,
      status: 'COMPLETED',
      submitted_at: new Date().toISOString(),
    });

    eventBus.publish('PERFORMANCE_REVIEW_COMPLETED', { reviewId, employeeId: review.employee_id, finalScore });
    return updated;
  }

  async getNineBoxMatrixDistribution(tenantId = 'org_tenant_enterprise_001') {
    const reviews = await db.all(
      `SELECT pr.*, e.first_name, e.last_name, e.employee_code, d.name as department_name
       FROM performance_reviews pr
       JOIN employees e ON pr.employee_id = e.id
       LEFT JOIN departments d ON e.department_id = d.id
       WHERE pr.tenant_id = ? AND pr.status = 'COMPLETED'`,
      [tenantId]
    );

    const matrix = {
      STAR: [],
      HIGH_POTENTIAL: [],
      ENIGMA: [],
      HIGH_PERFORMER: [],
      CORE_EMPLOYEE: [],
      DILEMMA: [],
      SOLID_PRO: [],
      UNDERPERFORMER: [],
      RISK: [],
    };

    reviews.forEach((r) => {
      const cat = r.nine_box_quadrant || 'CORE_EMPLOYEE';
      if (matrix[cat]) {
        matrix[cat].push(r);
      } else {
        matrix.CORE_EMPLOYEE.push(r);
      }
    });

    return matrix;
  }
}

module.exports = new PerformanceService();
