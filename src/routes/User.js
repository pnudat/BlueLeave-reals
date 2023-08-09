const express = require('express');
const router = express.Router();
const { oneUser,postgresData,birthDate,enteredDate } = require('../controllers/User')
const {
    VerifyToken
} = require('../midleware/Auth');

router.get('/user/:EmployeeID', async (req, res) => { // Express route สำหรับแสดงข้อมูลผู้ใช้คนเดียว
    const EmployeeID = req.params.EmployeeID;

    try {
        const [ldapData, pgData] = await Promise.all([
            oneUser(EmployeeID),
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

            res.json({ ldapData: ldapFormatData, pgFormatData });
        } else {
            res.status(404).json({ error: 'Data Entry Not Found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/user/:EmployeeID', async (req, res) => { // Express route สำหรับแสดงข้อมูลผู้ใช้คนเดียว
    const EmployeeID = req.params.EmployeeID;

    try {
        const [ldapData, pgData] = await Promise.all([
            oneUser(EmployeeID),
            postgresData(EmployeeID),
        ]);

        if (ldapData.length > 0) {
            const ldapEntry = ldapData[0];
            const ldapFormatData = {
                id: ldapEntry.attributes.find(attr => attr.type === "employeeID")?.values[0],
                name: ldapEntry.attributes.find(attr => attr.type === "cn")?.values[0],
                lastname: ldapEntry.attributes.find(attr => attr.type === "sn")?.values[0],
                username: ldapEntry.attributes.find(attr => attr.type === "sAMAccountName")?.values[0],
                date_of_birth: birthDate(ldapEntry.attributes.find(attr => attr.type === "pwdLastSet")?.values[0]),
                date_entered: enteredDate(ldapEntry.attributes.find(attr => attr.type === "whenCreated")?.values[0]),
                company: ldapEntry.attributes.find(attr => attr.type === "company")?.values[0],
                email: ldapEntry.attributes.find(attr => attr.type === "mail")?.values[0],
            };

            const pgFormatData = {
                id: pgData.employee_id,
                gender: pgData.gender_name,
                role: pgData.role_name,
                position: pgData.position_name,
            };

            res.json({ ldapData: ldapFormatData, postgresData: pgFormatData });
        } else {
            res.status(404).json({ error: 'Data Entry Not Found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;