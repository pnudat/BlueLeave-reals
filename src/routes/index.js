const express = require('express');
const adminRoute = require('./admin.router');
const usersRoute = require('./user.router');
const Login = require('../controllers/Login');

const route = express.Router();

route.post('/login', Login);
route.use('/private', adminRoute);
route.use('/public', usersRoute);

module.exports = route;