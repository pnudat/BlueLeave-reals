const { Pgconfig } = require('../configs');
const { Pool } = require('pg');

const POOL = new Pool(Pgconfig);

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
    holidayData,
    holidayCreate,
    holidayUpdate,
    holidayDelete
}