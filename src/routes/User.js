const express = require('express');
const router = express.Router();
const {
    oneUser,
    postgresData
} = require('../controllers/User')
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
            const ldapFormattedData = {
                id: ldapEntry.attributes.find(attr => attr.type === "employeeID")?.values[0],
                name: ldapEntry.attributes.find(attr => attr.type === "cn")?.values[0],
                lastname: ldapEntry.attributes.find(attr => attr.type === "sn")?.values[0],
                company: ldapEntry.attributes.find(attr => attr.type === "company")?.values[0],
                email: ldapEntry.attributes.find(attr => attr.type === "mail")?.values[0],
                status: ldapEntry.attributes.find(attr => attr.type === "userAccountControl")?.values[0] === "66048" ? "active" : "inactive",
            };

            const pgFormattedData = {
                id: pgData.employee_id,
                gender: pgData.gender_name,
                birth_date: pgData.birth_date,
                entered_date: pgData.entered_date,
                role_name: pgData.role_name,
                position_name: pgData.position_name,
            };

            res.json({ ldapData: ldapFormattedData, postgresData: pgFormattedData });
        } else {
            res.status(404).json({ error: 'LDAP Entry Not Found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;