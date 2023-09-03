const ldap = require('ldapjs');
const { Config,Pgconfig } = require('../../configs');
const { Pool } = require('pg');

const pgPool = new Pool(Pgconfig);

async function getAllUser() {
    return new Promise((resolve, reject) => {
        const ldapClient = ldap.createClient({ url: Config.url });

        ldapClient.bind(Config.adminDN, Config.adminPass, (err) => {
            if (err) {
                console.error('LDAP bind error:', err);
                return reject(err);
            }

            const searchOptions = {
                scope: 'sub',
                filter: '(employeeID=*)',
                attributes: ['cn', 'sn', 'company', 'mail', 'whenCreated', 'pwdLastSet', 'userAccountControl', 'employeeID']
            };

            ldapClient.search(Config.baseDN, searchOptions, (searchErr, searchRes) => {
                const users = [];

                if (searchErr) {
                    console.error('LDAP search error:', searchErr);
                    ldapClient.unbind();
                    return reject(searchErr);
                }

                searchRes.on('searchEntry', (entry) => {
                    users.push(entry.pojo); // Push the entry object into the users array
                });

                searchRes.on('error', (err) => {
                    console.error('LDAP search result error:', err);
                    ldapClient.unbind();
                    return reject(err);
                });

                searchRes.on('end', () => {
                    ldapClient.unbind();
                    return resolve(users);
                });
            });
        });
    });
}

async function postgresData() {
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
      ORDER BY employee.employee_id ASC;
      `;

        const { rows } = await pgPool.query(query);
        return rows;
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}

module.exports= {
    getAllUser,
    postgresData
}