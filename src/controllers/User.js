const ldap = require('ldapjs');
const { Config } = require('../config/Index');

// Function to search for a user by employeeID in LDAP
function searchLDAP(employeeID, callback) {
    const client = ldap.createClient({ url: Config.url });

    client.bind(Config.adminDN, Config.adminPass, (err) => {
        if (err) {
            callback(err);
            return;
        }

        const searchOptions = {
            filter: `(employeeID=${employeeID})`, // Use the employeeID parameter in the search filter
            scope: 'sub',
            attributes: ['personalTitle', 'displayName', 'co', 'groupPriority', 'sAMAccountName', 'company', 'department', 'c', 'whenCreated', 'pwdLastSet'],
        };

        client.search(Config.baseDN, searchOptions, (err, searchRes) => {
            if (err) {
                callback(err);
                return;
            }

            const entries = [];

            searchRes.on('searchEntry', (entry) => {
                entries.push(entry.object);
            });

            searchRes.on('error', (err) => {
                callback(err);
            });

            searchRes.on('end', (result) => {
                client.unbind((err) => {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, entries);
                    }
                });
            });
        });
    });
}

module.exports = {
    searchLDAP,
};