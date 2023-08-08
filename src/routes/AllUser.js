const express = require('express');
const router = express.Router();
const { VerifyToken } = require('../midleware/Auth');
const { getAllUser, postgresData } = require('../controllers/AllUser');

router.get('/users', (req, res) => {
    getAllUser(async (err, users) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching users from LDAP' });
        } else {
            const ldapData = users.map((entry) => ({
                id: entry.attributes.find(attr => attr.type === "employeeID")?.values[0],
                name: entry.attributes.find(attr => attr.type === "cn")?.values[0],
                lastname: entry.attributes.find(attr => attr.type === "sn")?.values[0],
                company: entry.attributes.find(attr => attr.type === "company")?.values[0],
                email: entry.attributes.find(attr => attr.type === "mail")?.values[0],
                status: entry.attributes.find(attr => attr.type === "userAccountControl")?.values[0] === "66048" ? "active" : "inactive",
            }));

            postgresData()
                .then((result) => {
                    const pgData = result.map((employee) => {
                        const startDate = new Date(employee.entered_date);
                        const curentDate = new Date();
                        const timeDiff = curentDate - startDate;
                        const daysPassed = timeDiff / (1000 * 60 * 60 * 24);
                        const yearsPassed = Math.floor(daysPassed / 365);
                        const monthsPassed = Math.floor((daysPassed % 365) / 30);
                        const daysRemaining = Math.floor((daysPassed % 365) % 30);

                        return {
                            id: employee.employee_id,
                            gender: employee.gender_name,
                            birth_date: employee.birth_date,
                            entered_date: ` ${yearsPassed} ปี ${monthsPassed} เดือน ${daysRemaining} วัน`,
                            role_name: employee.role_name,
                            position_name: employee.position_name,
                        };
                    });
                    res.json({ Data: ldapData, pgData });
                })
                .catch((err) => {
                    console.error('Error:', err);
                    res.status(500).json({ error: 'Not found data' });
                });
        }
    });
});

module.exports = router;