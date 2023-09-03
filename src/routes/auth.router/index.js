const express = require('express');
const Login = require('../../controllers/Login');

const route = express.Router();

route.post('/login', Login);

module.exports = route;