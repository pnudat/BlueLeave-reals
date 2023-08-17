const express = require('express');
const adminRoute = require('./admin.router/index');
const usersRoute = require('./user.router/index');
const Auth = require('./serviceLogin');

const route = express.Router();

route.use('/api', Auth)
route.use('/api', adminRoute);
route.use('/api', usersRoute);


module.exports = route;