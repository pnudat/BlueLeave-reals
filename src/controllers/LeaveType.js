const { Pgconfig } = require('../configs/configData');
const { Pool } = require('pg');

const pgPool = new Pool(Pgconfig);

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
        await pgPool.query(query,[leavetype_id, leavetype_name, working_period, days, gender_id]);
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

        await pgPool.query(query,[`${leavetype_name}`, working_period, days, gender_id, leavetype_id]);
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
    leavetypeData,
    leavetypeCreate,
    leavetypeUpdate,
    leavetypeDelete
}