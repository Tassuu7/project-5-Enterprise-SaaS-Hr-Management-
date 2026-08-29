/**
 * WorkSphere Enterprise HRMS - Absence & Leave Management Service
 * Layer: Business Logic (Services)
 */

const leaveRepository = require('../repositories/LeaveRepository');
const db = require('../database/connection');
const { ValidationError, NotFoundError, BusinessRuleViolationError } = require('../core/AppError');
const logger = require('../core/Logger');
const eventBus = require('../core/EventBus');

class LeaveService {
  async applyLeave(data, tenantId = 'org_tenant_enterprise_001') {
    const { employeeId, leaveTypeId, startDate, endDate, reason, isHalfDay } = data;

    if (!employeeId || !leaveTypeId || !startDate || !endDate || !reason) {
      throw new ValidationError('Employee, leave type, date range, and reason are mandatory');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      throw new ValidationError('End date cannot be prior to start date');
    }

    const totalDays = isHalfDay ? 0.5 : Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);

    // Check balance
    const currentYear = start.getFullYear();
    const balance = await db.get(
      'SELECT * FROM leave_balances WHERE employee_id = ? AND leave_type_id = ? AND year = ?',
      [employeeId, leaveTypeId, currentYear]
    );

    if (balance) {
      const available = (balance.allocated_days + balance.carried_forward_days) - (balance.used_days + balance.pending_days);
      if (available < totalDays) {
        throw new BusinessRuleViolationError('INSUFFICIENT_LEAVE_BALANCE', `Required ${totalDays} days, but only ${available} days available in quota`);
      }
    }

    const request = await leaveRepository.create({
      tenant_id: tenantId,
      employee_id: employeeId,
      leave_type_id: leaveTypeId,
      start_date: startDate,
      end_date: endDate,
      total_days: totalDays,
      is_half_day: isHalfDay ? 1 : 0,
      reason,
      status: 'PENDING',
    });

    // Update pending balance
    if (balance) {
      await db.run('UPDATE leave_balances SET pending_days = pending_days + ? WHERE id = ?', [totalDays, balance.id]);
    }

    eventBus.publish('LEAVE_APPLIED', { requestId: request.id, employeeId, totalDays });
    return request;
  }

  async actionLeave(requestId, status, approvedByUserId, managerComment = '') {
    const request = await leaveRepository.findById(requestId);
    if (!request) throw new NotFoundError('LeaveRequest', requestId);

    if (request.status !== 'PENDING') {
      throw new ValidationError(`Leave request is already actioned as ${request.status}`);
    }

    const currentYear = new Date(request.start_date).getFullYear();
    const balance = await db.get(
      'SELECT * FROM leave_balances WHERE employee_id = ? AND leave_type_id = ? AND year = ?',
      [request.employee_id, request.leave_type_id, currentYear]
    );

    if (status === 'APPROVED') {
      if (balance) {
        await db.run(
          'UPDATE leave_balances SET pending_days = pending_days - ?, used_days = used_days + ? WHERE id = ?',
          [request.total_days, request.total_days, balance.id]
        );
      }
    } else if (status === 'REJECTED') {
      if (balance) {
        await db.run(
          'UPDATE leave_balances SET pending_days = pending_days - ? WHERE id = ?',
          [request.total_days, balance.id]
        );
      }
    }

    const updated = await leaveRepository.update(requestId, {
      status,
      approved_by: approvedByUserId,
      manager_comment: managerComment,
      actioned_at: new Date().toISOString(),
    });

    eventBus.publish('LEAVE_STATUS_CHANGED', { requestId, status, employeeId: request.employee_id });
    return updated;
  }

  async getEmployeeLeaveBalances(employeeId, year = null) {
    const targetYear = year || new Date().getFullYear();
    return db.all(
      `SELECT lb.*, lt.name as leave_type_name, lt.code as leave_type_code, lt.is_paid
       FROM leave_balances lb
       JOIN leave_types lt ON lb.leave_type_id = lt.id
       WHERE lb.employee_id = ? AND lb.year = ?`,
      [employeeId, targetYear]
    );
  }

  async getLeaveRequests(filter = {}, options = {}) {
    return leaveRepository.findDetailed(filter, options);
  }
}

module.exports = new LeaveService();
