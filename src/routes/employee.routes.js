const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/EmployeeController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/', EmployeeController.getAll);
router.get('/departments', EmployeeController.getDepartments);
router.get('/designations', EmployeeController.getDesignations);
router.get('/:id', EmployeeController.getById);
router.post('/', EmployeeController.create);
router.put('/:id', EmployeeController.update);
router.delete('/:id', EmployeeController.delete);

module.exports = router;
