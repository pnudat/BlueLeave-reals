const ldap = require('ldapjs');
const {

    Config

} = require('../config/Index');

function LdapSearchOneUser(EmployeeID, callback) {
    
    const client = ldap.createClient({
        url: Config.url
    });

    client.bind(Config.adminDN, Config.adminPass, (err) => {
        if (err) {
            client.unbind();
            return callback(err);
        }

        const searchOptions = {
            filter: `(employeeID=${EmployeeID})`, // กำหนด employeeID เป็นเลข
            scope: 'sub',
            attributes: ['cn', 'sn', 'company', 'sAMAccountName', 'mail', 'department'], // กำหนด attribute ที่ต้องการให้แสดง
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

module.exports = {
    LdapSearchOneUser
};