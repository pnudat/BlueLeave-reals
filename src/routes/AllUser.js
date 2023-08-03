const express = require('express');
const router = express.Router();
const {
    VerifyToken
} = require('../midleware/Auth');
const {
    LdapSearchAllUser
} = require('../controllers/AllUser');

// Route เพื่อดึงข้อมูล user ทั้งหมด
router.get('/users', VerifyToken, (req, res) => {
    LdapSearchAllUser((err, users) => {
        if (err) {
            return res.status(500).json({
                error: 'Error fetching users from LDAP'
            });
        }

        return res.json(users);
    });
});

// outer.put('/update', VerifyToken, (req, res) => {
//     res.status(200).send('Welcome User:id');
// });

module.exports = router;