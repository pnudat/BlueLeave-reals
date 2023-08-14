const ldap = require('ldapjs');
const {
    Config
} = require('../configs/configData');

const client = ldap.createClient({
    url: Config.url,
});

const FindUser = (username, callback) => {  // find user by username for connecting

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

        const dataList = [];

        client.search(Config.baseDN, searchOptions, (searchErr, searchRes) => {
            if (searchErr) {
                console.error('LDAP search error:', searchErr);
                return callback(searchErr);
            }

            searchRes.on('searchEntry', (entry) => {
                dataList.push(entry.object);
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
                    return callback(null, dataList);
                });
            });
        });
    });
}


function connectLdap(_username, _password, __bindDN) { 
    return new Promise((resolve, reject) => {
        client.bind(Config.adminDN, Config.adminPass, (bindErr) => {
            if (bindErr) {
                console.error(`LDAP bind error for ${Config.url}:`, bindErr);
                reject(bindErr);
                return;
            }
            // console.log(`Successfully bound to LDAP server: ${Config.url}`);
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
    connectLdap,
};