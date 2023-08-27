const express = require('express');
const inform = require('./inform');
const publicHoliday = require('./publicHoliday');

const routers = express.Router();

routers.use('/inform', inform);
routers.get('/publicHoliday', publicHoliday);
// routers.get('/policy', express.static('/src/upload/filePolicy'));

module.exports = routers;