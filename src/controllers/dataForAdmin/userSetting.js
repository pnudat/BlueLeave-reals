const ldap = require('ldapjs');
const { Config, Pgconfig } = require('../../configs');
const { Pool } = require('pg');
const { birthDate, enteredDate } = require('../../helpers');

const pgPool = new Pool(Pgconfig);

async function getEmployeeID(req, res) {
    const EmployeeID = req.params.EmployeeID;

    try {
        const [ldapData, pgData] = await Promise.all([
            getLdapData(EmployeeID),
            getPostgresData(EmployeeID),
        ]);

        if (ldapData.length > 0) {
            const ldapEntry = ldapData[0];
            const ldapFormatData = {
                id: ldapEntry.attributes.find(attr => attr.type === "employeeID")?.values[0],
                name: ldapEntry.attributes.find(attr => attr.type === "cn")?.values[0],
                lastname: ldapEntry.attributes.find(attr => attr.type === "sn")?.values[0],
                username: ldapEntry.attributes.find(attr => attr.type === "sAMAccountName")?.values[0],
                gender: pgData.gender_name,
                date_of_birth: birthDate(ldapEntry.attributes.find(attr => attr.type === "pwdLastSet")?.values[0]),
                date_entered: enteredDate(ldapEntry.attributes.find(attr => attr.type === "whenCreated")?.values[0]),
                company: ldapEntry.attributes.find(attr => attr.type === "company")?.values[0],
                role: pgData.role_name,
                position: pgData.position_name,
                email: ldapEntry.attributes.find(attr => attr.type === "mail")?.values[0],
            };
            res.json(ldapFormatData);
        } else {
            res.status(404).json({ error: 'Data Entry Not Found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function updateRole(req, res) {
    const { EmployeeID } = req.params;
    const { role_id } = req.body;

    try {
        const result = await updateRoleInPostgres(EmployeeID, role_id); // Assuming you have an updateRoleInDatabase function
        res.status(200).json({ message: result });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ error: 'An error occurred while updating role.' });
    }
}

async function getLdapData(EmployeeID) {
    return new Promise((resolve, reject) => {
        const client = ldap.createClient({
            url: Config.url
        });

        client.bind(Config.adminDN, Config.adminPass, async (err) => {
            if (err) {
                client.unbind();
                return reject(err);
            }

            const searchOptions = {
                filter: `(employeeID=${EmployeeID})`,
                scope: 'sub',
                attributes: ['cn', 'sn', 'company', 'sAMAccountName', 'mail', 'department', 'pwdLastSet', 'whenCreated'],
            };

            try {
                const results = [];
                client.search(Config.baseDN, searchOptions, (searchErr, searchRes) => {
                    if (searchErr) {
                        client.unbind();
                        return reject(searchErr);
                    }

                    searchRes.on('searchEntry', (entry) => {
                        results.push(entry.pojo);
                    });

                    searchRes.on('error', (error) => {
                        client.unbind();
                        reject(error);
                    });

                    searchRes.on('end', () => {
                        client.unbind();
                        resolve(results);
                    });
                });
            } catch (error) {
                reject(error);
            }
        });
    });
}

async function getPostgresData(EmployeeID) {   // res to postgres database
    try {
        const query = `
        SELECT
            employee.employee_id,
            gender.gender_name,
            role.role_name,
            position.position_name
        FROM
            employee
        LEFT JOIN gender ON employee.gender_id = gender.gender_id
        LEFT JOIN role ON employee.role_id = role.role_id
        LEFT JOIN position ON employee.position_id = position.position_id
        WHERE employee_id = $1
        `;
        const values = [EmployeeID];

        const result = await pgPool.query(query, values);

        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

async function updateRoleInPostgres(EmployeeID, role_id) {    // update approver values
    try {
        if (role_id < 1 || role_id > 3) {
            throw new Error('Invalid role_id value. It must be between 1 and 3.');
        }

        const query = 'UPDATE employee SET role_id = $1 WHERE employee_id = $2';
        await pgPool.query(query, [role_id, EmployeeID]);
        return 'Role updated successfully.';
    } catch (error) {
        throw error;
    }
}

// find approver data in ldap and update to postgres

module.exports = {
    getEmployeeID,
    updateRole
};