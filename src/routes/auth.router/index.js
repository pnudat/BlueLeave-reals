const express = require('express');
const Login = require('../../controllers/authentication');

const route = express.Router();

route.post('/login', Login);

module.exports = route;