const express = require('express');
const admin = require('../../../controllers');

const router = express.Router();

router.get('/', admin.dataForAdmin.getUsersData);
router.get('/:EmployeeID', admin.dataForAdmin.getEmployeeID);
router.put('/:EmployeeID', admin.dataForAdmin.updateRole);

module.exports = router;