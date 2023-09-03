const express = require('express');
const AdminRoute = require('./Admin');
const UsersRoute = require('./Users');
const AuthenRoute = require('./Authen');

const route = express.Router();

route.use('/auth', AuthenRoute);
route.use('/private', AdminRoute);
route.use('/public', UsersRoute);

module.exports = route;