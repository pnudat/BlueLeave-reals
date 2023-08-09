const ldap = require('ldapjs');
const { Config, Pgconfig } = require('../config/Index');
const { Pool } = require('pg');

const pgPool = new Pool(Pgconfig);

function getAllUser(callback) { // Function to initialize and bind the LDAP client
  const ldapClient = ldap.createClient({ url: Config.url });

  ldapClient.bind(Config.adminDN, Config.adminPass, (err) => {
    if (err) {
      console.error('LDAP bind error:', err);
      return callback(err, null);
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
        return callback(searchErr, null);
      }

      searchRes.on('searchEntry', (entry) => {
        users.push(entry.pojo);  //object or pojo 
      });

      searchRes.on('error', (err) => {
        console.error('LDAP search result error:', err);
        return callback(err, null);
      });

      searchRes.on('end', () => {
        ldapClient.unbind();
        return callback(null, users);
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
      LEFT JOIN position ON employee.position_id = position.position_id;
    `;

    const { rows } = await pgPool.query(query);
    return rows;
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
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



module.exports = {
  getAllUser,
  postgresData,
  birthDate
};