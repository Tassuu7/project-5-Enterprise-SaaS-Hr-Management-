/**
 * WorkSphere Enterprise HRMS - Employee Controller
 * Layer: Controllers
 */

const employeeService = require('../services/EmployeeService');
const ResponseFormatter = require('../core/ResponseFormatter');

class EmployeeController {
  static async getAll(req, res, next) {
    try {
      const employees = await employeeService.getAllEmployees({ tenant_id: req.tenantId });
      return ResponseFormatter.success(res, employees, 'Employees retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const employee = await employeeService.getEmployeeById(req.params.id, req.tenantId);
      return ResponseFormatter.success(res, employee, 'Employee details retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const employee = await employeeService.createEmployee(req.body, req.tenantId);
      return ResponseFormatter.created(res, employee, 'Employee created successfully');
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const updated = await employeeService.updateEmployee(req.params.id, req.body, req.tenantId);
      return ResponseFormatter.success(res, updated, 'Employee updated successfully');
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await employeeService.deleteEmployee(req.params.id, req.tenantId);
      return ResponseFormatter.success(res, { id: req.params.id }, 'Employee removed');
    } catch (err) {
      next(err);
    }
  }

  static async getDepartments(req, res, next) {
    try {
      const depts = await employeeService.getDepartmentList(req.tenantId);
      return ResponseFormatter.success(res, depts, 'Departments retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async getDesignations(req, res, next) {
    try {
      const desgs = await employeeService.getDesignationList(req.tenantId);
      return ResponseFormatter.success(res, desgs, 'Designations retrieved');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = EmployeeController;
