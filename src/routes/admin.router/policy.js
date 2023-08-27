const express = require('express');
const admin = require('../../controllers');
// const { upload } = require('../../middlewares/Upload');

const router = express.Router();

// router.get('/policy',);
router.post('/policy', upload, admin.dataForAdmin.savePolicy);
router.delete('/policy/:policy_id', admin.dataForAdmin.deletePolicy);

module.exports = router;