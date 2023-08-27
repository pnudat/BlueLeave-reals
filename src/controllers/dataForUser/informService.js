const axios = require('axios');
const ldap = require('ldapjs');
const moment = require('moment');
const { Pool } = require('pg');
const { Pgconfig, Key } = require('../../configs');
const { formatDate } = require('../../helpers');

const pgPool = new Pool(Pgconfig);

async function getInformData(req, res) {
    try {
        const EmployeeID = req.params.id;
        const data = await informData(EmployeeID);

        const formattedData = data.map(item => ({
            ...item,
            inform_date: moment(item.inform_date).format('DD/MM/YYYY')
        }));

        res.status(200).json(formattedData);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function sendLineNotify(req, res) {
    const EmployeeID = req.params.id;
    const informDate = req.body.informDate;
    const informType = req.body.informType;
    const description = req.body.description;

    try {
        const employeeData = await getUser(EmployeeID);

        if (employeeData.length > 0) {
            const employeeInfo = employeeData[0];
            const ldapName = { name: `${employeeInfo.attributes.find(attr => attr.type === "cn")?.values[0]} ${employeeInfo.attributes.find(attr => attr.type === "sn")?.values[0]}` };
            const ldapNameString = ldapName.name;
            
            const dateData = await formatDate(informDate);
            await informCreate(EmployeeID, dateData, informType, description);
            await lineNotify(ldapNameString, informDate, informType, description);

            res.status(200).json({ message: 'Line Notify sent successfully' });
        } else {
            res.status(404).json({ error: 'Employee not found in LDAP' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to send Line Notify' });
    }
}

async function getUser(EmployeeID) {
    return new Promise((resolve, reject) => {
        const client = ldap.createClient({
            url: 'ldap://adbl.local:389'
        });

        client.bind('cn=adminblueseas,cn=Users,dc=wk,dc=local', 'Wuekr0@1', async (err) => {
            if (err) {
                client.unbind();
                reject(err);
            }

            const searchOptions = {
                filter: `(employeeID=${EmployeeID})`,
                scope: 'sub',
                attributes: ['cn', 'sn'],
            };

            try {
                const entries = await new Promise((resolve, reject) => {
                    const results = [];
                    client.search('dc=wk,dc=local', searchOptions, (searchErr, searchRes) => {
                        if (searchErr) {
                            client.unbind();
                            reject(searchErr);
                        }

                        searchRes.on('searchEntry', (entry) => {
                            results.push(entry.pojo);
                        });

                        searchRes.on('error', (error) => {
                            client.unbind();
                            reject(error);
                        });

                        searchRes.on('end', () => {
                            client.unbind();
                            resolve(results);
                        });
                    });
                });

                resolve(entries);
            } catch (error) {
                reject(error);
            }
        });
    });
}

async function informData(EmployeeID) {
    try {
        const query = `
        SELECT
            inform_date,
            inform_type,
            description
        FROM
            inform
        WHERE inform_id = $1
        ORDER BY inform.inform_id ASC;
        `;

        const { rows } = await pgPool.query(query, [EmployeeID]);
        return rows;
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}

async function informCreate(EmployeeID, informDate, informType, description) {
    try {
        const query = `INSERT INTO inform(inform_id, inform_date, inform_type, description) VALUES ($1, $2, $3, $4);`;
        await pgPool.query(query, [EmployeeID, informDate, informType, description]);
        return 'Leave type created successfully';
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}

async function lineNotify(ldapNameString, informDate, informType, description) {
    try {
        const message = `\nคุณ: ${ldapNameString}\nวันที่: ${informDate}\nประเภท: ${informType}\nรายละเอียด: ${description}`;

        const response = await axios.post(
            'https://notify-api.line.me/api/notify',
            `message=${message}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${Key.lineNotify}`
                }
            }
        );

        console.log('Line Notify response:', response.data);
    } catch (error) {
        console.error('Error sending Line Notify:', error);
    }
}

module.exports = {
    getInformData,
    sendLineNotify,
}