const { Pgconfig } = require('../../configs');
const { Pool } = require('pg');

const pgPool = new Pool(Pgconfig);

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

async function leavetypeData() {
    try {
        const query = `
        SELECT
                leave_type.leave_type_id,
                leave_type.leave_name,
                leave_type.working_period,
                leave_type.days,
                gender.gender_name
        FROM
            leave_type
        LEFT JOIN gender ON leave_type.gender_id = gender.gender_id
        WHERE is_delete = FALSE
        ORDER BY leave_type.leave_type_id ASC;
        `;

        const { rows } = await pgPool.query(query);
        return rows;
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}

async function leavetypeCreate(leavetype_id, leavetype_name, working_period, days, gender_id) {
    try {
        const query = `INSERT INTO leave_type(leave_type_id, leave_name, working_period, days, gender_id) VALUES ($1, $2, $3, $4, $5);`;
        await pgPool.query(query, [leavetype_id, leavetype_name, working_period, days, gender_id]);
        return 'Leave type created successfully';
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}

async function leavetypeUpdate(leavetype_name, working_period, days, gender_id, leavetype_id) {
    try {
        const query = `
        UPDATE public.leave_type
        SET leave_name = $1, working_period = $2, days = $3, gender_id = $4
        WHERE leave_type_id = $5;
        `;

        await pgPool.query(query, [`${leavetype_name}`, working_period, days, gender_id, leavetype_id]);
        return 'Leave type updated successfully';
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}

async function leavetypeDelete(leavetype_id) {
    try {
        const query = `
        UPDATE leave_type
        SET is_delete = TRUE
        WHERE leave_type_id = $1;
        `;
        await pgPool.query(query, [leavetype_id]);
        return 'Leave type deleted successfully';
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}

module.exports = {
    getAllLeaveTypes,
    createLeaveType,
    updateLeaveType,
    deleteLeaveType
}