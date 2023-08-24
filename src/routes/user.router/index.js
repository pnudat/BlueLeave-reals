const express = require('express');
const user = require('../../controllers');

const routers = express.Router();

routers.get('/inform/:id', user.dataForUser.getInformData);
routers.post('/inform/:id', user.dataForUser.sendLineNotify);

routers.get('/publicHoliday/:id', user.dataForUser.allPublicHoliday);

routers.get('/policy', express.static('/src/upload/filePolicy'));


module.exports = routers;