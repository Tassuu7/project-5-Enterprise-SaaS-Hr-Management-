/**
 * WorkSphere Enterprise HRMS - Analytics Controller
 * Layer: Controllers
 */

const analyticsService = require('../services/AnalyticsService');
const ResponseFormatter = require('../core/ResponseFormatter');

class AnalyticsController {
  static async getSummary(req, res, next) {
    try {
      const summary = await analyticsService.getDashboardSummary(req.tenantId);
      return ResponseFormatter.success(res, summary, 'Dashboard BI summary retrieved');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AnalyticsController;
