const { leavetypeData, leavetypeCreate, leavetypeUpdate, leavetypeDelete} = require('../../../models/leavetpye');

async function getAllLeaveTypes(req, res) { // Get all leave types
    try {
        const data = await leavetypeData();
        res.status(200).json(data);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function createLeaveType(req, res) { // Create a new leave type
    try {
        const leavetype_id = req.body.leavetype_id;
        const leavetype_name = req.body.leavetype_name;
        const working_period = req.body.working_period;
        const days = req.body.days;
        const gender_id = req.body.gender_id;

        const result = await leavetypeCreate(leavetype_id, leavetype_name, working_period, days, gender_id);

        res.status(201).json({ message: result });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateLeaveType(req, res) {
    try {
        const leavetype_id = req.params.leavetype_id;
        const leavetype_name = req.body.leavetype_name;
        const working_period = req.body.working_period;
        const days = req.body.days;
        const gender_id = req.body.gender_id;

        if (gender_id === 1 || gender_id === 3) {
            const result = await leavetypeUpdate(leavetype_name, working_period, days, gender_id, leavetype_id);
            res.status(200).json({ message: result });
        } else {
            res.status(404).json({ message: 'Invalid gender_id' });
        }

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteLeaveType(req, res) {
    try {
        const leavetype_id = req.params.leavetype_id;
        const result = await leavetypeDelete(leavetype_id);

        res.status(200).json({ message: result });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getAllLeaveTypes,
    createLeaveType,
    updateLeaveType,
    deleteLeaveType
}