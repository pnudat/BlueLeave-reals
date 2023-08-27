const express = require('express');
const users = require('./userSetting');
const leaveType = require('./leaveType');
const publicHoliday = require('./publicHoliday');
const policy = require('./policy');
// const { upload } = require('../../middlewares/Upload');

const routers = express.Router();

routers.use('/users', users);
routers.use('/leavetypes', leaveType);
routers.use('/publicHoliday', publicHoliday);
routers.use('/policy', policy);

module.exports = routers;