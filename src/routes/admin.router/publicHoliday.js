const express = require('express');
const admin = require('../../controllers');

const router = express.Router();

router.get('/', admin.dataForAdmin.allPublicHoliday);
router.post('/', admin.dataForAdmin.createPublicHoliday);
router.put('/:holiday_id', admin.dataForAdmin.updatePublicHoliday);
router.delete('/:holiday_id', admin.dataForAdmin.deletePublicHoliday);

module.exports = router;