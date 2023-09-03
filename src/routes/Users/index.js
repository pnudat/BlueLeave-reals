const express = require('express');
const inform = require('./Inform');
const publicHoliday = require('./PublicHoliday');

const routers = express.Router();

routers.use('/inform', inform);
routers.use('/public-holiday', publicHoliday);
// routers.use('/policy', express.static('/src/upload/filePolicy'));

module.exports = routers;