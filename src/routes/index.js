const express = require('express');
const adminRoute = require('./admin.router');
const usersRoute = require('./user.router');
const authentication = require('./auth.router');

const route = express.Router();

route.use('/auth', authentication);
route.use('/private', adminRoute);
route.use('/public', usersRoute);

module.exports = route;