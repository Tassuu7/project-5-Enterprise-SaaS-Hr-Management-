const express = require('express');
const router = express.Router();
const LeaveController = require('../controllers/LeaveController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/requests', LeaveController.getAllRequests);
router.post('/apply', LeaveController.apply);
router.put('/requests/:id/action', LeaveController.action);
router.get('/balances/:employeeId', LeaveController.getBalances);

module.exports = router;
