const express = require('express');
const router = express.Router();
const { getUser, postgresData, birthDate, enteredDate, updateRole, ldapApprove, pgApprove } = require('../controllers/userSetting')
const {
    VerifyToken
} = require('../midleware/Auth');

router.get('/user/:EmployeeID', async (req, res) => {
    const EmployeeID = req.params.EmployeeID;

    try {
        const [ldapData, pgData] = await Promise.all([
            getUser(EmployeeID),
            postgresData(EmployeeID),
        ]);

        if (ldapData.length > 0) {
            const ldapEntry = ldapData[0];
            const ldapFormatData = {
                id: ldapEntry.attributes.find(attr => attr.type === "employeeID")?.values[0],
                name: ldapEntry.attributes.find(attr => attr.type === "cn")?.values[0],
                lastname: ldapEntry.attributes.find(attr => attr.type === "sn")?.values[0],
                username: ldapEntry.attributes.find(attr => attr.type === "sAMAccountNamen")?.values[0],
                date_of_birth: birthDate(ldapEntry.attributes.find(attr => attr.type === "pwdLastSet")?.values[0]),
                date_entered: enteredDate(ldapEntry.attributes.find(attr => attr.type === "whenCreated")?.values[0]),
                company: ldapEntry.attributes.find(attr => attr.type === "company")?.values[0],
                email: ldapEntry.attributes.find(attr => attr.type === "mail")?.values[0],
            };

            const pgFormatData = {
                id: pgData.employee_id,
                gender: pgData.gender_name,
                role_name: pgData.role_name,
                position_name: pgData.position_name,
            };

            res.json({ ldapData: ldapFormatData, postgresData: pgFormatData });
        } else {
            res.status(404).json({ error: 'Data Entry Not Found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/user/update/:EmployeeID', async (req, res) => {
    const { EmployeeID } = req.params;
    const { role_id } = req.body;

    try {
        const result = await updateRole(EmployeeID, role_id);
        res.status(200).json({ message: result });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ error: 'An error occurred while updating role.' });
    }
});

router.put('/user/update/approver', async (req, res) => {
    const EmployeeID = req.params.employee_id;
    const Approver = req.body;

    try {
        const [ldapData, pgData] = await Promise.all([
            ldapApprove(Approver),
            pgApprove(EmployeeID),
        ]);

        console.log(ldapData);
        console.log(pgData);

        if (ldapData.length === 0) {
            return res.status(404).json({ error: 'Data Entry Not Found' });
        }

        const approveEntry = ldapData[0];
        const approveID = approveEntry.attributes.find(attr => attr.type === "employeeID")?.values[0];
        const approverName = approveEntry.attributes.find(attr => attr.type === "name")?.values[0];
        const approverCompany = approveEntry.attributes.find(attr => attr.type === "company")?.values[0];
        const approverDepartment = approveEntry.attributes.find(attr => attr.type === "department")?.values[0];
        const pgID = pgData.employee_id;
        const pgRole = pgData.name_role;

        if (approveID !== pgID) {
            return console.log('EmployeeID is not true');
        }

        if (pgRole === 3) {
            // Role is admin, allow approval
            if (approverCompany === "Commserv Siam Ltd." && approverDepartment === approverDepartment) {
                return res.json({ Approver: approverName });
            } else {
                return console.log(`Employee does not have approval rights for this company/${approverDepartment}`);
            }
        } else if (pgRole === 2) {
            if (approverCompany === "Commserv Siam Ltd." && approverDepartment === approverDepartment) {
                return res.json({ Approver: approverName });
            } else {
                return console.log(`Employee does not have approval rights for this company/${approverDepartment}`);
            }
        } else {
            // Role is employee without approval rights
            return console.log('Role cannot approve because role is employee');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

module.exports = router;