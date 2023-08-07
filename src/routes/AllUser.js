const express = require('express');
const router = express.Router();
const {

    VerifyToken

} = require('../midleware/Auth');
const {

    LdapSearchAllUser

} = require('../controllers/AllUser');

router.get('/users', VerifyToken,(req, res) => { // Route เพื่อดึงข้อมูล user ทั้งหมด

    LdapSearchAllUser((err, users) => {
        if (err) {

            return res.status(500).json({
                error: 'Error fetching users from LDAP'

            });
        }else {

            const reformattedData = users.map((entry) => ({
                id: entry.attributes.find(attr => attr.type === "employeeID")?.values[0],
                name: entry.attributes.find(attr => attr.type === "cn")?.values[0],
                lastname: entry.attributes.find(attr => attr.type === "sn")?.values[0],
                company: entry.attributes.find(attr => attr.type === "company")?.values[0],
                email: entry.attributes.find(attr => attr.type === "mail")?.values[0],
                status: entry.attributes.find(attr => attr.type === "userAccountControl")?.values[0] === "66048" ? "active" : "inactive",
            
            }))

            res.json(reformattedData);
        }
    });
});

module.exports = router;