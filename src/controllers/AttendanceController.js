/**
 * WorkSphere Enterprise HRMS - Attendance Controller
 * Layer: Controllers
 */

const attendanceService = require('../services/AttendanceService');
const ResponseFormatter = require('../core/ResponseFormatter');

class AttendanceController {
  static async punchIn(req, res, next) {
    try {
      const { employeeId, notes } = req.body;
      const ip = req.ip || '127.0.0.1';
      const record = await attendanceService.punchIn(employeeId, ip, notes, req.tenantId);
      return ResponseFormatter.success(res, record, 'Punched in successfully');
    } catch (err) {
      next(err);
    }
  }

  static async punchOut(req, res, next) {
    try {
      const { employeeId, notes } = req.body;
      const ip = req.ip || '127.0.0.1';
      const record = await attendanceService.punchOut(employeeId, ip, notes);
      return ResponseFormatter.success(res, record, 'Punched out successfully');
    } catch (err) {
      next(err);
    }
  }

  static async getDailyOverview(req, res, next) {
    try {
      const overview = await attendanceService.getDailyAttendanceOverview(req.query.date, req.tenantId);
      return ResponseFormatter.success(res, overview, 'Daily attendance retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async getMonthly(req, res, next) {
    try {
      const { employeeId, month, year } = req.query;
      const records = await attendanceService.getMonthlyAttendance(employeeId, month || new Date().getMonth() + 1, year || new Date().getFullYear());
      return ResponseFormatter.success(res, records, 'Monthly attendance logs retrieved');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AttendanceController;
