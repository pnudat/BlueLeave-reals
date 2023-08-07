const express = require('express');
const router = express.Router();
const {
    LdapSearchOneUser
} = require('../controllers/User')
const {
    VerifyToken
} = require('../midleware/Auth');

router.get('/user/:EmployeeID', VerifyToken, (req, res) => { // Express route สำหรับแสดงข้อมูลผู้ใช้คนเดียว
    const EmployeeID = req.params.EmployeeID;

    LdapSearchOneUser(EmployeeID, (err, userData) => {
        if (err) {
            return res.status(500).json({
                error: 'Failed to fetch user data'
            });
        }

        if (userData.length === 0) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        const reformattedData = userData.map((entry) => ({
            name: entry.attributes.find(attr => attr.type === "cn")?.values[0],
            lastname: entry.attributes.find(attr => attr.type === "sn")?.values[0],
            email: entry.attributes.find(attr => attr.type === "mail")?.values[0],
            username: entry.attributes.find(attr => attr.type === "sAMAccountName")?.values[0],
            company: entry.attributes.find(attr => attr.type === "company")?.values[0],
            department: entry.attributes.find(attr => attr.type === "department")?.values[0]
        }))
        res.json(reformattedData);
    });
});

module.exports = router;