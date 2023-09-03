const express = require('express');
const Login = require('../../controllers/auth');

const route = express.Router();

route.post('/login', Login);

module.exports = route;