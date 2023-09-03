const express = require('express');
const users = require('./usersetting');
const leaveType = require('./leavetype');
const publicHoliday = require('./public_holiday');
const policy = require('./policy');
// const { upload } = require('../../middlewares/Upload');

const routers = express.Router();

routers.use('/users', users);
routers.use('/leavetype', leaveType);
routers.use('/public-holiday', publicHoliday);
routers.use('/policy', policy);

module.exports = routers;