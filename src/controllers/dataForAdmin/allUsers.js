
const { birthDate, calWorkExp } = require('../../helpers');
const { getAllUser, postgresData } = require('../../models/allUser');
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

module.exports = {
  getUsersData,
};