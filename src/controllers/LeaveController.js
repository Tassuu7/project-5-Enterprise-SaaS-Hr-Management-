/**
 * WorkSphere Enterprise HRMS - Leave Controller
 * Layer: Controllers
 */

const leaveService = require('../services/LeaveService');
const ResponseFormatter = require('../core/ResponseFormatter');

class LeaveController {
  static async apply(req, res, next) {
    try {
      const request = await leaveService.applyLeave(req.body, req.tenantId);
      return ResponseFormatter.created(res, request, 'Leave application submitted');
    } catch (err) {
      next(err);
    }
  }

  static async action(req, res, next) {
    try {
      const { status, managerComment } = req.body;
      const updated = await leaveService.actionLeave(req.params.id, status, req.user.id, managerComment);
      return ResponseFormatter.success(res, updated, `Leave request marked as ${status}`);
    } catch (err) {
      next(err);
    }
  }

  static async getBalances(req, res, next) {
    try {
      const balances = await leaveService.getEmployeeLeaveBalances(req.params.employeeId, req.query.year);
      return ResponseFormatter.success(res, balances, 'Leave balances retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async getAllRequests(req, res, next) {
    try {
      const requests = await leaveService.getLeaveRequests({ tenant_id: req.tenantId });
      return ResponseFormatter.success(res, requests, 'Leave requests retrieved');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = LeaveController;
