const express = require('express');
const Login = require('../../controllers/AuthenControl');

const route = express.Router();

route.post('/login', Login);

module.exports = route;