const express = require('express');
const admin = require('../../controllers');
const { upload } = require('../../middlewares/Upload');

const router = express.Router();

// router.get('/',);
router.post('/', upload, admin.dataForAdmin.savePolicy);
router.delete('/:policy_id', admin.dataForAdmin.deletePolicy);

module.exports = router;