const { Pool } = require('pg');
const { Pgconfig } = require('../../configs');

const pool = new Pool(Pgconfig);

async function savePolicy(req, res) {
    try {
        const data = req.body;
        data.file = req.file.filename;

        const policy = await policySave(data)

        res.status(200).json({ message: policy });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

async function deletePolicy(req, res) {
    try {
        const policy_id = req.params.policy_id;
        const remove = await policyDelete(policy_id);
        await fs.unlink('/src/upload/filePolicy' + remove.file, (err)=>{
            if (err) {
                console.log(err);
            }else{
                console.log('Delete file successfully');
            }
        })

        res.status(200).json({ message: remove });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function policySave(data) {
    try {
        const query = `INSERT INTO files(filename) VALUES ($1);`;
        await pool.query(query, [data]);
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
    savePolicy,
    deletePolicy
}
