const express = require('express');
const router = express.Router();
const { VerifyToken } = require('../midleware/Auth');
const { getAllUser, postgresData,birthDate } = require('../controllers/AllUser');

router.get('/users', (req, res) => {
    getAllUser(async (err, users) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching users from LDAP' });
        } else {
            const ldapData = users.map((entry) => {
                const ldapDate = entry.attributes.find(attr => attr.type === "whenCreated")?.values[0];
                const year = ldapDate.slice(0, 4);
                const month = ldapDate.slice(4, 6);
                const day = ldapDate.slice(6, 8);
                
                const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
                const formattedDate = `${date.getUTCDate().toString().padStart(2, '0')}/${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCFullYear()}`;
                const currentDate = new Date();
            
                const workExperience = currentDate - date;
                const dateNow = new Date(workExperience);
                
                const years = dateNow.getUTCFullYear() - 1970;
                const months = dateNow.getUTCMonth();
                const days = dateNow.getUTCDate() - 1;
            
                return {
                    id: entry.attributes.find(attr => attr.type === "employeeID")?.values[0],
                    name: entry.attributes.find(attr => attr.type === "cn")?.values[0],
                    lastname: entry.attributes.find(attr => attr.type === "sn")?.values[0],
                    company: entry.attributes.find(attr => attr.type === "company")?.values[0],
                    date_entered: formattedDate,
                    date_of_birth: birthDate(entry.attributes.find(attr => attr.type === "pwdLastSet")?.values[0]),
                    email: entry.attributes.find(attr => attr.type === "mail")?.values[0],
                    status: entry.attributes.find(attr => attr.type === "userAccountControl")?.values[0] === "66048" ? "active" : "inactive",
                    working_period: `${years} years ${months} months ${days} days`,
                };
            });            
            

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