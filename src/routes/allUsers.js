const express = require('express');
const router = express.Router();
const { VerifyToken } = require('../middlewares/Auth');
const { birthDate,calWorkExp } = require('../helpers/helpers');
const { getAllUser, postgresData } = require('../controllers/allUsers');

router.get('/users', (req, res) => {
    getAllUser(async (err, users) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching users from LDAP' });
        } else {
            
            const ldapData = users.map((entry) => {
                const ldapDate = entry.attributes.find(attr => attr.type === "whenCreated")?.values[0];
                const result = calWorkExp(ldapDate);

                return {
                    id: entry.attributes.find(attr => attr.type === "employeeID")?.values[0],
                    name: `${entry.attributes.find(attr => attr.type === "cn")?.values[0]} ${entry.attributes.find(attr => attr.type === "sn")?.values[0]}`,
                    company: entry.attributes.find(attr => attr.type === "company")?.values[0],
                    date_entered: result.formattedDate,
                    date_of_birth: birthDate(entry.attributes.find(attr => attr.type === "pwdLastSet")?.values[0]),
                    email: entry.attributes.find(attr => attr.type === "mail")?.values[0],
                    status: entry.attributes.find(attr => attr.type === "userAccountControl")?.values[0] === "66048" ? "active" : "inactive",
                    working_period: `${result.years} years ${result.months} months ${result.days} days`,
                };
            });

            postgresData()
                .then((result) => {
                    const pgData = result.map((employee) => {
                        return {
                            id: employee.employee_id,
                            gender: employee.gender_name,
                            role: employee.role_name,
                            position: employee.position_name,
                        };
                    });
                    const combinedData = [...ldapData, ...pgData].sort((a, b) => {
                        return a.id - b.id;
                    });
                    res.json({ Data: combinedData });
                })
                .catch((pgErr) => {
                    console.error('Error:', pgErr);
                    res.status(500).json({ error: 'Error fetching PostgreSQL data' });
                });
        }
    });
});

module.exports = router;