const express = require('express');
const router = express.Router();
const { VerifyToken } = require('../middlewares/Auth');
const { leavetypeData, leavetypeCreate, leavetypeUpdate, leavetypeDelete } = require('../controllers/leaveType');

router.get('/leavetypes', async (req, res) => { // Get all leave types
    try {
        const data = await leavetypeData();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/leavetypes', async (req, res) => { // Create a new leave type
    try {
        const leavetype_id = req.body.leavetype_id;
        const leavetype_name = req.body.leavetype_name;
        const working_period = req.body.working_period;
        const days = req.body.days;
        const gender_id = req.body.gender_id;
        result = await leavetypeCreate(leavetype_id, leavetype_name, working_period, days, gender_id);
        res.status(201).json({ message: result });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/leavetype/:leavetype_id', async (req, res) => {    // Update leave type
    try {
        const leavetype_id = req.params.leavetype_id;
        const leavetype_name = req.body.leavetype_name;
        const working_period = req.body.working_period;
        const days = req.body.days;
        const gender_id = req.body.gender_id;

        const result = await leavetypeUpdate(leavetype_name, working_period, days, gender_id, leavetype_id);

        res.status(200).json({ message: result });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete('/leavetype/:leavetype_id', async (req, res) => { //delete leave type
    try {
        const leavetype_id = req.params.leavetype_id;
        result = await leavetypeDelete(leavetype_id);
        res.status(200).json({ message: result });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;