const ldap = require('ldapjs');
const { Config } = require('../config/Index');
const { Pool } = require('pg');

const pgPool = new Pool({
    user: 'postgres',
    password: 'Pass@27052002',
    host: 'localhost',
    database: 'blueleave',
    port: 5432,
});


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
                attributes: ['cn', 'sn', 'company', 'sAMAccountName', 'mail', 'department'],
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
        SELECT e.*, g.gender_name, b.birth_date, d.entered_date, r.role_name, p.position_name
        FROM employee e
        JOIN gender g ON e.gender_id = g.gender_id
        JOIN date_of_birth b ON e.birth_id = b.birth_id
        JOIN date_entered d ON e.entered_id = d.entered_id
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

module.exports = {
    oneUser,
    postgresData
};