const { Pgconfig } = require('../../../configs');
const { holidayDate } = require('../../../helpers');
const { Pool } = require('pg');

const pg = new Pool(Pgconfig);

async function allPublicHoliday(req, res) { // Get all leave types
    try {
        const data = await holidayData();
        const pgData = data.map((holiday) => {
            return {
                holiday_date: holidayDate(holiday.holiday_date),
                description: holiday.description,
                status: holiday.status,
            };
        });
        res.status(200).json(pgData);
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

        const { rows } = await pg.query(query);
        return rows;
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}

module.exports = {
    allPublicHoliday
}