const express = require('express');
const admin = require('../../../controllers');

const router = express.Router();

router.get('/', admin.dataForAdmin.getAllLeaveTypes);
router.post('/', admin.dataForAdmin.createLeaveType);
router.put('/:leavetype_id', admin.dataForAdmin.updateLeaveType);
router.delete('/:leavetype_id', admin.dataForAdmin.deleteLeaveType);

module.exports = router;