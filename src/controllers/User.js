const ldap = require('ldapjs');
const { Config } = require('../config/Index');
const { Pool } = require('pg');

function oneUser(EmployeeID, callback) {
    const client = ldap.createClient({
        url: Config.url
    });

    client.bind(Config.adminDN, Config.adminPass, (err) => {
        if (err) {
            client.unbind();
            return callback(err);
        }

        const searchOptions = {
            filter: `(employeeID=${EmployeeID})`,
            scope: 'sub',
            attributes: ['cn', 'sn', 'company', 'sAMAccountName', 'mail', 'department'],
        };

        client.search(Config.baseDN, searchOptions, (searchErr, searchRes) => {
            if (searchErr) {
                console.error('LDAP search error:', searchErr);
                reject(searchErr);
            }
            const entries = [];
            searchRes.on('searchEntry', (entry) => {
                entries.push(entry.pojo);
            });

            searchRes.on('error', (error) => {
                client.unbind();
                return callback(error);
            });

            searchRes.on('end', () => {
                client.unbind();
                return callback(null, entries);
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
          date_of_birth.birth_date,
          date_entered.entered_date,
          role.role_name,
          position.position_name
        FROM
          employee
        LEFT JOIN gender ON employee.gender_id = gender.gender_id
        LEFT JOIN date_of_birth ON employee.birth_id = date_of_birth.birth_id
        LEFT JOIN date_entered ON employee.entered_id = date_entered.entered_id
        LEFT JOIN role ON employee.role_id = role.role_id
        LEFT JOIN position ON employee.position_id = position.position_id;
      `;

        const { rows } = await pgPool.query(query);
        return rows;
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}

module.exports = {
    oneUser
};