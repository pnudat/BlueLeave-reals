const ldap = require('ldapjs');
const { Config, Pgconfig } = require('../config/Index');
const { Pool } = require('pg');
const pgPool = new Pool(Pgconfig);

async function oneUser(EmployeeID) {
    return new Promise((resolve, reject) => {
        const client = ldap.createClient({
            url: Config.url
        });

        client.bind(Config.adminDN, Config.adminPass, async (err) => {
            if (err) {
                client.unbind();
                reject(err);
            }

            const searchOptions = {
                filter: `(employeeID=${EmployeeID})`,
                scope: 'sub',
                attributes: ['cn', 'sn', 'company', 'sAMAccountName', 'mail', 'department', 'pwdLastSet', 'whenCreated'],
            };

            try {
                const entries = await new Promise((resolve, reject) => {
                    const results = [];
                    client.search(Config.baseDN, searchOptions, (searchErr, searchRes) => {
                        if (searchErr) {
                            client.unbind();
                            reject(searchErr);
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
                });

                resolve(entries);
            } catch (error) {
                reject(error);
            }
        });
    });
}

async function postgresData(EmployeeID) {
    try {
        const query = `
        SELECT e.*, g.gender_name, r.role_name, p.position_name
        FROM employee e
        JOIN gender g ON e.gender_id = g.gender_id
        JOIN role r ON e.role_id = r.role_id
        JOIN position p ON e.position_id = p.position_id
        WHERE e.employee_id = $1`;
        const values = [EmployeeID];

        const result = await pgPool.query(query, values);

        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

function birthDate(ldapTime) {
    const Timestamp = parseInt(ldapTime) / 10000000 - 11644473600;
    const dateObject = new Date(Timestamp * 1000);

    const day = dateObject.getUTCDate().toString().padStart(2, '0');
    const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = dateObject.getUTCFullYear();

    return `${day}/${month}/${year}`;
}

function enteredDate(ldapDate) {
    const year = ldapDate.slice(0, 4);
    const month = ldapDate.slice(4, 6);
    const day = ldapDate.slice(6, 8);

    const date = new Date(`${year}-${month}-${day}T00:00:00Z`);

    const formatDate = `${date.getUTCDate().toString().padStart(2, '0')}/${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCFullYear()}`;

    return formatDate;
}

async function updateRole(EmployeeID, role_id) {
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

module.exports = {
    oneUser,
    postgresData,
    birthDate,
    enteredDate,
    updateRole
};