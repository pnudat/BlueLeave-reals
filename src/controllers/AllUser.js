const ldap = require('ldapjs');
const {
    Config
} = require('../config/Index');

function LdapSearchAllUser(callback) { // Function to initialize and bind the LDAP client
    const ldapClient = ldap.createClient({
        url: Config.url,
    });

    ldapClient.bind(Config.adminDN, Config.adminPass, (err) => {
        if (err) {
            console.error('LDAP bind error:', err);
            return callback(err, null);
        }

        const searchOptions = {
            scope: 'sub',
            filter: '(employeeID=*)',
            attributes: ['cn', 'sn', 'company', 'mail', 'userAccountControl', 'employeeID']
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

module.exports = {
    LdapSearchAllUser,
};