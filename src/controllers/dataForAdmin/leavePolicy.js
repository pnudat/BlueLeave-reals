const { Pool } = require('pg');
const { Pgconfig } = require('../../configs');

const pool = new Pool(Pgconfig);

async function savePolicy(req, res) {
    try {
        // const filename = req.file;
        console.log(req.body)
        console.log(req.file)
        // const policy = await policySave(filename)

        res.send("filename")
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

async function deletePolicy(req, res) {
    try {
        const policy_id = req.params.policy_id;
        const remove = await policyDelete(policy_id);
        await fs.unlink('../../upload/fileExcel/' + remove.file, (err)=>{
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

async function policySave(filename) {
    try {
        const query = `INSERT INTO file(filename) VALUES ($1);`;
        await pool.query(query, [filename]);
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
