const ldap = require('ldapjs');
const { Config, Pgconfig } = require('../configs/configData');
const { Pool } = require('pg');
const pgPool = new Pool(Pgconfig);

async function getUser(EmployeeID) {
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

async function postgresData(EmployeeID) {   // res to postgres database
    try {
        const query = `
        SELECT e.*, g.gender_name, r.role_name, p.position_name
            FROM employee e
            JOIN gender g ON e.gender_id = g.gender_id
            JOIN role r ON e.role_id = r.role_id
            JOIN position p ON e.position_id = p.position_id
            WHERE e.employee_id = $1
        `;
        const values = [EmployeeID];

        const result = await pgPool.query(query, values);

        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

async function updateRole(EmployeeID, role_id) {    // update approver values
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
    getUser,
    postgresData,
    updateRole,
};