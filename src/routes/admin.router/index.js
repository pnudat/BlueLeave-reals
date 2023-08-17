const express = require('express');
const allUsers = require('./allUsers');
const leaveType = require('./leaveType');
const userSetting = require('./userSetting');

const router = express.Router();

router.use('/admin', allUsers);
router.use('/admin', leaveType);
router.use('/admin', userSetting);

module.exports = router;