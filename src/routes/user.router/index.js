const express = require('express');
const inform = require('./inform');

const router = express.Router();

router.use('/user', inform);

module.exports = router;