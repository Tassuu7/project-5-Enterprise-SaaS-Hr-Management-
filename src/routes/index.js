/**
 * WorkSphere Enterprise HRMS - Master API Router Aggregator
 * Layer: Routes
 */

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const employeeRoutes = require('./employee.routes');
const attendanceRoutes = require('./attendance.routes');
const leaveRoutes = require('./leave.routes');
const payrollRoutes = require('./payroll.routes');
const recruitmentRoutes = require('./recruitment.routes');
const performanceRoutes = require('./performance.routes');
const analyticsRoutes = require('./analytics.routes');

router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/leaves', leaveRoutes);
router.use('/payroll', payrollRoutes);
router.use('/recruitment', recruitmentRoutes);
router.use('/performance', performanceRoutes);
router.use('/analytics', analyticsRoutes);

router.get('/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    system: 'WorkSphere Enterprise HRMS',
    version: '4.2.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

module.exports = router;
