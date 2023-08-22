const express = require('express');
const user = require('../../controllers');

const routers = express.Router();

routers.get('/inform/:id', user.dataForUser.getInformData);
routers.post('/inform/:id', user.dataForUser.sendLineNotify);

module.exports = routers;