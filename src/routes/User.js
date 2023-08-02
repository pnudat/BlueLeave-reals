const express = require('express');
const router = express.Router();
const {
    LdapSearchOneUser
} = require('../controllers/User')
const {
    VerifyToken
} = require('../midleware/Auth');

router.get('/user/:EmployeeID', VerifyToken, (req, res) => {// Express route สำหรับแสดงข้อมูลผู้ใช้คนเดียว
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
        
        res.json(userData); // นำข้อมูลผู้ใช้ที่ได้มาแสดงผลหรือใช้ตามที่คุณต้องการ
    });
});

module.exports = router;