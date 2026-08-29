const express = require('express');
const router = express.Router();
const PayrollController = require('../controllers/PayrollController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.post('/run', PayrollController.runPayroll);
router.post('/disburse/:id', PayrollController.disburse);
router.get('/payslip/:id', PayrollController.getPayslip);
router.post('/calculate-estimate', PayrollController.calculateEstimate);

module.exports = router;
