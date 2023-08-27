const express = require('express');
const user = require('../../controllers');

const routers = express.Router();

routers.get('/publicHoliday/:id', user.dataForUser.allPublicHoliday);

module.exports = routers;