const { Pgconfig } = require('../../configs');
const { Pool } = require('pg');
const { holidayDate } = require('../../helpers');

const POOL = new Pool(Pgconfig);

async function allPublicHoliday(req, res) { // Get all leave types
    try {
        const data = await holidayData();
        const mappedData = data.map(item => {
            return {
                date: holidayDate(item.holiday_date),
                description: item.description,
                status: item.status,
            };
        });

        res.status(200).json(mappedData);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function createPublicHoliday(req, res) { // Create a new leave type
    try {
        const holiday_date = req.body.holiday_date;
        const description = req.body.description;
        const status = req.body.status;
        if (status === 'active' || status === 'inactive') {
            const result = await holidayCreate(holiday_date, description, status);

            res.status(201).json({ message: result });
        } else {
            res.status(404).json({ message: 'Please enter the data correctly' });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updatePublicHoliday(req, res) {
    try {
        const holiday_id = req.params.holiday_id;
        const holiday_date = req.body.holiday_date;
        const description = req.body.description;
        const status = req.body.status;
        const result = await holidayUpdate(holiday_id, holiday_date, description, status);

        res.status(201).json({ message: result });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deletePublicHoliday(req, res) {
    try {
        const holiday_id = req.params.holiday_id;
        const result = await holidayDelete(holiday_id);

        res.status(200).json({ message: result });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function holidayData() {
    try {
        const query = `
        SELECT
            holiday_date,description,status
        FROM
            test_holiday
        ORDER BY test_holiday.holiday_date ASC;
        `;

        const { rows } = await POOL.query(query);
        return rows;
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}

async function holidayCreate(holiday_date, description, status) {
    try {
        const query = `INSERT INTO test_holiday(holiday_date, description, status) VALUES ($1, $2, $3);`;
        await POOL.query(query, [`${holiday_date}`, `${description}`, `${status}`]);
        return 'Public Holiday created successfully';
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}

async function holidayUpdate(holiday_id, holiday_date, description, status) {
    try {
        const query = `
        UPDATE public.test_holiday
        SET holiday_date = $1, description = $2, status = $3
        WHERE holiday_id = $5;
        `;

        await POOL.query(query, [`${holiday_date}`, `${description}`, `${status}`, holiday_id]);
        return 'Leave type updated successfully';
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}

async function holidayDelete(holiday_id) {
    try {
        const query = `
        DELETE FROM test_holiday
        WHERE holiday_id = $1;
        `;
        await POOL.query(query, [holiday_id]);
        return 'Public Holiday deleted successfully';
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}

module.exports = {
    allPublicHoliday,
    createPublicHoliday,
    updatePublicHoliday,
    deletePublicHoliday
}