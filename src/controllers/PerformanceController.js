/**
 * WorkSphere Enterprise HRMS - Performance Controller
 * Layer: Controllers
 */

const performanceService = require('../services/PerformanceService');
const ResponseFormatter = require('../core/ResponseFormatter');

class PerformanceController {
  static async getGoals(req, res, next) {
    try {
      const goals = await performanceService.getEmployeeGoals(req.params.employeeId);
      return ResponseFormatter.success(res, goals, 'Goals retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async createGoal(req, res, next) {
    try {
      const goal = await performanceService.createGoal(req.body, req.tenantId);
      return ResponseFormatter.created(res, goal, 'Goal created');
    } catch (err) {
      next(err);
    }
  }

  static async submitReview(req, res, next) {
    try {
      const review = await performanceService.submitReview(req.params.reviewId, req.body);
      return ResponseFormatter.success(res, review, 'Performance review completed');
    } catch (err) {
      next(err);
    }
  }

  static async getNineBoxMatrix(req, res, next) {
    try {
      const matrix = await performanceService.getNineBoxMatrixDistribution(req.tenantId);
      return ResponseFormatter.success(res, matrix, '9-Box talent grid retrieved');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PerformanceController;
