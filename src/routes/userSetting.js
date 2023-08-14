const express = require('express');
const router = express.Router();
const { getUser, postgresData,updateRole, } = require('../controllers/userSetting')
const {
    VerifyToken
} = require('../midlewares/Auth');
const { enteredDate, birthDate} = require('../helpers/helpers');

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
                gender: pgData.gender_name,
                date_of_birth: birthDate(ldapEntry.attributes.find(attr => attr.type === "pwdLastSet")?.values[0]),
                date_entered: enteredDate(ldapEntry.attributes.find(attr => attr.type === "whenCreated")?.values[0]),
                company: ldapEntry.attributes.find(attr => attr.type === "company")?.values[0],
                role: pgData.role_name,
                position: pgData.position_name,
                email: ldapEntry.attributes.find(attr => attr.type === "mail")?.values[0],                                                                                                                                                      
            };
            res.json({ Data: ldapFormatData});
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

// find Approver

module.exports = router;