const ldap = require('ldapjs'); // connect to the Ldap server
const {
    Config
} = require('../config/Index');

const client = ldap.createClient({
    url: Config.url,
});

const FindUser = (username, callback) => { // find user at Ldap server

    const client = ldap.createClient({
        url: Config.url,
    });

    client.bind(Config.adminDN, Config.adminPass, (err) => {
        if (err) {
            console.error('LDAP bind error:', err);
            return callback(err);
        }

        const searchOptions = {
            scope: 'sub',
            filter: `(sAMAccountName=${username})`,
            attributes: ['ou'],
        };

        const ouList = [];

        client.search(Config.baseDN, searchOptions, (searchErr, searchRes) => {
            if (searchErr) {
                console.error('LDAP search error:', searchErr);
                return callback(searchErr);
            }

            searchRes.on('searchEntry', (entry) => {
                ouList.push(entry.object);
            });

            searchRes.on('error', (err) => {
                console.error('LDAP search result error:', err);
            });

            searchRes.on('end', () => {
                client.unbind((unbindErr) => {
                    if (unbindErr) {
                        console.error('LDAP unbind error:', unbindErr);
                        return callback(unbindErr);
                    }
                    return callback(null, ouList);
                });
            });
        });
    });
}

// bind to the server
function BindToLdapServer(username, password, bindDN) {
    return new Promise((resolve, reject) => {
        client.bind(Config.adminDN, Config.adminPass, (bindErr) => {
            if (bindErr) {
                console.error(`LDAP bind error for ${Config.url}:`, bindErr);
                reject(bindErr);
                return;
            }
            // console.log(`Successfully bound to LDAP server: ${Config.url}`);
            // Unbind or disconnect from the server
            client.unbind((unbindErr) => {
                if (unbindErr) {
                    console.error(`LDAP unbind error for ${Config.url}:`, unbindErr);
                    reject(unbindErr);
                    return;
                }
                // console.log(`Successfully unbound from LDAP server: ${Config.url}`);
                resolve();
            });
        });
    });
}

module.exports = {
    FindUser,
    BindToLdapServer,
};