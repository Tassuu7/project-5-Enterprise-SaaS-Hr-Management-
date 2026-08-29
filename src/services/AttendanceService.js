/**
 * WorkSphere Enterprise HRMS - Attendance & Time Tracking Service
 * Layer: Business Logic (Services)
 */

const attendanceRepository = require('../repositories/AttendanceRepository');
const db = require('../database/connection');
const { ValidationError, NotFoundError } = require('../core/AppError');
const logger = require('../core/Logger');
const eventBus = require('../core/EventBus');

class AttendanceService {
  async punchIn(employeeId, ipAddress = '127.0.0.1', notes = null, tenantId = 'org_tenant_enterprise_001') {
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toISOString();

    const existing = await attendanceRepository.findOne({ employee_id: employeeId, date: today });
    if (existing && existing.punch_in_time) {
      throw new ValidationError('Employee has already punched in for today');
    }

    // Determine shift & late status
    const shift = await db.get('SELECT * FROM shifts WHERE tenant_id = ? LIMIT 1', [tenantId]);
    let isLate = 0;
    let lateMinutes = 0;

    if (shift) {
      const punchDate = new Date();
      const [shiftHour, shiftMinute] = shift.start_time.split(':').map(Number);
      const shiftStartTime = new Date();
      shiftStartTime.setHours(shiftHour, shiftMinute, 0, 0);

      const diffMs = punchDate - shiftStartTime;
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins > shift.grace_period_minutes) {
        isLate = 1;
        lateMinutes = diffMins;
      }
    }

    let record;
    if (existing) {
      record = await attendanceRepository.update(existing.id, {
        punch_in_time: now,
        punch_in_ip: ipAddress,
        status: isLate ? 'LATE' : 'PRESENT',
        is_late: isLate,
        late_by_minutes: lateMinutes,
        notes: notes || existing.notes,
      });
    } else {
      record = await attendanceRepository.create({
        tenant_id: tenantId,
        employee_id: employeeId,
        shift_id: shift ? shift.id : null,
        date: today,
        punch_in_time: now,
        punch_in_ip: ipAddress,
        status: isLate ? 'LATE' : 'PRESENT',
        is_late: isLate,
        late_by_minutes: lateMinutes,
        notes,
      });
    }

    eventBus.publish('ATTENDANCE_PUNCHED_IN', { employeeId, punchTime: now });
    return record;
  }

  async punchOut(employeeId, ipAddress = '127.0.0.1', notes = null) {
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toISOString();

    const existing = await attendanceRepository.findOne({ employee_id: employeeId, date: today });
    if (!existing || !existing.punch_in_time) {
      throw new ValidationError('No punch-in record found for today to punch out against');
    }

    const punchIn = new Date(existing.punch_in_time);
    const punchOut = new Date(now);
    const durationHours = Math.max(0, (punchOut - punchIn) / 3600000);
    const overtimeHours = Math.max(0, durationHours - 8.0);

    const record = await attendanceRepository.update(existing.id, {
      punch_out_time: now,
      punch_out_ip: ipAddress,
      total_work_hours: parseFloat(durationHours.toFixed(2)),
      overtime_hours: parseFloat(overtimeHours.toFixed(2)),
      notes: notes ? `${existing.notes || ''} | ${notes}` : existing.notes,
    });

    eventBus.publish('ATTENDANCE_PUNCHED_OUT', { employeeId, punchTime: now, totalHours: record.total_work_hours });
    return record;
  }

  async getMonthlyAttendance(employeeId, month, year) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

    return db.all(
      `SELECT a.*, s.name as shift_name
       FROM attendances a
       LEFT JOIN shifts s ON a.shift_id = s.id
       WHERE a.employee_id = ? AND a.date BETWEEN ? AND ?
       ORDER BY a.date ASC`,
      [employeeId, startDate, endDate]
    );
  }

  async getDailyAttendanceOverview(date, tenantId = 'org_tenant_enterprise_001') {
    const targetDate = date || new Date().toISOString().slice(0, 10);
    const totalEmployees = await db.get('SELECT COUNT(*) as count FROM employees WHERE tenant_id = ? AND employment_status = "ACTIVE"', [tenantId]);
    const attendanceRecords = await db.all(
      `SELECT a.*, e.first_name, e.last_name, e.employee_code, d.name as department_name
       FROM attendances a
       JOIN employees e ON a.employee_id = e.id
       LEFT JOIN departments d ON e.department_id = d.id
       WHERE a.tenant_id = ? AND a.date = ?`,
      [tenantId, targetDate]
    );

    const presentCount = attendanceRecords.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;
    const lateCount = attendanceRecords.filter((r) => r.is_late === 1).length;

    return {
      date: targetDate,
      totalActiveEmployees: totalEmployees.count,
      presentCount,
      absentCount: Math.max(0, totalEmployees.count - presentCount),
      lateCount,
      records: attendanceRecords,
    };
  }
}

module.exports = new AttendanceService();
