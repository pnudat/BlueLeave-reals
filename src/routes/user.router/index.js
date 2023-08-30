const express = require('express');
const inform = require('./inform');
const publicHoliday = require('./publicHoliday');

const routers = express.Router();

routers.use('/inform', inform);
routers.use('/publicHoliday', publicHoliday);
// routers.use('/policy', express.static('/src/upload/filePolicy'));

module.exports = routers;