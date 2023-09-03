const { getLdapData, getPostgresData, updateRoleInPostgres} = require('../../../models/UserSettingService');
const { birthDate, enteredDate } = require('../../../helpers');

async function getEmployeeID(req, res) {
    const EmployeeID = req.params.EmployeeID;

    try {
        const [ldapData, pgData] = await Promise.all([
            getLdapData(EmployeeID),
            getPostgresData(EmployeeID),
        ]);

        if (ldapData.length > 0) {
            const ldapEntry = ldapData[0];
            const ldapFormatData = {
                id: ldapEntry.attributes.find(attr => attr.type === "employeeID")?.values[0],
                name: ldapEntry.attributes.find(attr => attr.type === "cn")?.values[0],
                lastname: ldapEntry.attributes.find(attr => attr.type === "sn")?.values[0],
                username: ldapEntry.attributes.find(attr => attr.type === "sAMAccountName")?.values[0],
                gender: pgData.gender_name,
                date_of_birth: birthDate(ldapEntry.attributes.find(attr => attr.type === "pwdLastSet")?.values[0]),
                date_entered: enteredDate(ldapEntry.attributes.find(attr => attr.type === "whenCreated")?.values[0]),
                company: ldapEntry.attributes.find(attr => attr.type === "company")?.values[0],
                role: pgData.role_name,
                position: pgData.position_name,
                email: ldapEntry.attributes.find(attr => attr.type === "mail")?.values[0],
            };
            res.json(ldapFormatData);
        } else {
            res.status(404).json({ error: 'Data Entry Not Found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function updateRole(req, res) {
    const { EmployeeID } = req.params;
    const { role_id } = req.body;

    try {
        const result = await updateRoleInPostgres(EmployeeID, role_id); // Assuming you have an updateRoleInDatabase function
        res.status(200).json({ message: result });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ error: 'An error occurred while updating role.' });
    }
}

module.exports = {
    getEmployeeID,
    updateRole
};