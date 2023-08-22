const ldap = require('ldapjs');
const { Config, Pgconfig } = require('../../configs');
const { Pool } = require('pg');
const { birthDate,calWorkExp } = require('../../helpers');

const pgPool = new Pool(Pgconfig);

async function getUsersData(req, res) {
  try {
      getAllUser(async (err, users) => {
          if (err) {
              return res.status(500).json({ error: 'Error fetching users from LDAP' });
          } else {
              const ldapData = users.map((entry) => {
                  const ldapDate = entry.attributes.find(attr => attr.type === "whenCreated")?.values[0];
                  const result = calWorkExp(ldapDate);

                  return {
                      id: entry.attributes.find(attr => attr.type === "employeeID")?.values[0],
                      name: `${entry.attributes.find(attr => attr.type === "cn")?.values[0]} ${entry.attributes.find(attr => attr.type === "sn")?.values[0]}`,
                      company: entry.attributes.find(attr => attr.type === "company")?.values[0],
                      date_entered: result.formattedDate,
                      date_of_birth: birthDate(entry.attributes.find(attr => attr.type === "pwdLastSet")?.values[0]),
                      email: entry.attributes.find(attr => attr.type === "mail")?.values[0],
                      status: entry.attributes.find(attr => attr.type === "userAccountControl")?.values[0] === "66048" ? "active" : "inactive",
                      working_period: `${result.years} years ${result.months} months ${result.days} days`,
                  };
              });

              postgresData()
                  .then((result) => {
                      const pgData = result.map((employee) => {
                          return {
                              id: employee.employee_id,
                              gender: employee.gender_name,
                              role: employee.role_name,
                              position: employee.position_name,
                          };
                      });
                      const combinedData = [...ldapData, ...pgData].sort((a, b) => {
                          return a.id - b.id;
                      });
                      res.json({ Data: combinedData });
                  })
                  .catch((pgErr) => {
                      console.error('Error:', pgErr);
                      res.status(500).json({ error: 'Error fetching PostgreSQL data' });
                  });
          }
      });
  } catch (error) {
      console.log('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
}

function getAllUser(callback) {
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
  postgresData,
};