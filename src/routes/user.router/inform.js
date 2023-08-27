const express = require('express');
const user = require('../../controllers');

const router = express.Router();

router.get('/:id', user.dataForUser.getInformData);
router.post('/:id', user.dataForUser.sendLineNotify);

module.exports = router;