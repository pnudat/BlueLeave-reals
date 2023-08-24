const ldap = require('ldapjs');
const { Config, Pgconfig } = require('../../configs');
const { Pool } = require('pg');
const { birthDate,calWorkExp } = require('../../helpers');

const pgPool = new Pool(Pgconfig);

async function getUsersData(req, res) {
  try {
      const ldapUsers = await getAllUser();
      const pgEmployees = await postgresData();

      console.log(ldapUsers)
      console.log(pgEmployees)

      const mappedData = ldapUsers.map((entry) => {
          const ldapDate = entry.attributes.find(attr => attr.type === "whenCreated")?.values[0];
          const result = calWorkExp(ldapDate);

          const pgData = pgEmployees.find(pgEntry => pgEntry.id === entry.attributes.find(attr => attr.type === "employeeID")?.values[0]);

          const mappedEntry = {
              id: entry.attributes.find(attr => attr.type === "employeeID")?.values[0],
              name: `${entry.attributes.find(attr => attr.type === "cn")?.values[0]} ${entry.attributes.find(attr => attr.type === "sn")?.values[0]}`,
              gender: pgData ? pgData.gender : null,
              company: entry.attributes.find(attr => attr.type === "company")?.values[0],
              role: pgData ? pgData.role : null,
              position: pgData ? pgData.position : null,
              date_entered: result.formattedDate,
              date_of_birth: birthDate(entry.attributes.find(attr => attr.type === "pwdLastSet")?.values[0]),
              email: entry.attributes.find(attr => attr.type === "mail")?.values[0],
              working_period: `${result.years} years ${result.months} months ${result.days} days`,
              status: entry.attributes.find(attr => attr.type === "userAccountControl")?.values[0] === "66048" ? "active" : "inactive",
          };
          // console.log(mappedEntry);
          return mappedEntry;
      });

      const combinedData = mappedData.sort((a, b) => a.id - b.id);

      res.json(combinedData);
  } catch (error) {
      console.log('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
}

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

module.exports = {
  getUsersData,
};