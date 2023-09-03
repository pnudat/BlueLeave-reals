const { Pool } = require('pg');
const { Pgconfig } = require('../../configs');

const pool = new Pool(Pgconfig);

async function policySave(file) {
    try {
        const query = `INSERT INTO files(filename) VALUES ($1);`;
        await pool.query(query, [file]);
        return 'Leave Policy created successfully';
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}

async function policyDelete(policy_id) {
    try {
        const query = `
        DELETE FROM test_holiday
        WHERE id = $1;
        `;
        await pgPool.query(query, [policy_id]);
        return 'Leave type deleted successfully';
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}

module.exports = {
    policySave,
    policyDelete
}