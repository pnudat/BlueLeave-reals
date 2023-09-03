const { policySave, policyDelete } =require('../../../models/leavePolicy');

async function savePolicy(req, res) {
    try {
        const file = req.file.filename;

        const policy = await policySave(file)

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
        await fs.unlink('/src/upload/filePolicy' + remove.file, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Delete file successfully');
            }
        })

        res.status(200).json({ message: remove });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    savePolicy,
    deletePolicy
}
