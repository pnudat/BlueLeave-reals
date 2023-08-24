const express = require('express');
const adminRoute = require('./admin.router');
const usersRoute = require('./user.router');
const middlewares = require('../middlewares');

const route = express.Router();

route.post('/login',middlewares.authenticate);
route.use('/admin', adminRoute);
route.use('/user', usersRoute);


module.exports = route;