
const { birthDate, calWorkExp } = require('../../helpers');
const { getAllUser, postgresData } = require('../../models/allUser');

async function getUsersData(req, res) {
  try {
    const ldapUsers = await getAllUser();
    const pgEmployees = await postgresData();

    const ldapData = ldapUsers.map((entry) => {
      const object = {};
      entry.attributes.forEach((users) => {
        const { type, values } = users;
        object[type] = values[0];
      });
      return { ...object, ...pgEmployees.find((results) => results.employee_id === parseInt(object.employeeID)) };
    });
    const combinedData = ldapData.map(({ cn, sn, whenCreated, company, role_name, userAccountControl }) => {
      return {
        firstName: cn,
        lastName: sn,
        company: company,
        workPeriod: calWorkExp(whenCreated).workTime,
        role: role_name,
        status: userAccountControl === "66048" ? "active" : "inactive"
      }
    })
    res.status(200).json(combinedData);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = getUsersData;