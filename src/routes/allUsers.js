const express = require('express');
const router = express.Router();
const { VerifyToken } = require('../midlewares/Auth');
const { birthDate } = require('../helpers/helpers');
const { getAllUser, postgresData } = require('../controllers/allUsers');

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
                    name: `${entry.attributes.find(attr => attr.type === "cn")?.values[0]} ${entry.attributes.find(attr => attr.type === "sn")?.values[0]}`,
                    company: entry.attributes.find(attr => attr.type === "company")?.values[0],
                    date_entered: formattedDate,
                    date_of_birth: birthDate(entry.attributes.find(attr => attr.type === "pwdLastSet")?.values[0]),
                    email: entry.attributes.find(attr => attr.type === "mail")?.values[0],
                    status: entry.attributes.find(attr => attr.type === "userAccountControl")?.values[0] === "66048" ? "active" : "inactive",
                    working_period: `${years} years ${months} months ${days} days`,
                };
            });

            postgresData()
                .then((pgResult) => {
                    const pgData = pgResult.map((employee) => {
                        return {
                            id: employee.employee_id,
                            gender: employee.gender_name,
                            role: employee.role_name,
                            position: employee.position_name,
                        };
                    });
                    const combinedData = ldapData.map((users) => {
                        const PGUser = pgData.find((pgResult) => pgResult.id === users.id);
                        return {
                            id: users.id,
                            name: users.name,
                            company: users.company,
                            date_entered: users.date_entered,
                            date_of_birth: users.date_of_birth,
                            email: users.email,
                            status: users.status,
                            working_period: users.working_period,
                            gender: PGUser ? PGUser.gender : null,
                            role: PGUser ? PGUser.role : null,
                            position: PGUser ? PGUser.position : null,
                        };
                    });

                    res.json({ CombinedData: combinedData });
                })
                .catch((pgErr) => {
                    console.error('Error:', pgErr);
                    res.status(500).json({ error: 'Error fetching PostgreSQL data' });
                });
        }
    });
});

module.exports = router;
