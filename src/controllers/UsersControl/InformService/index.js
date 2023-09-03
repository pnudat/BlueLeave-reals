const { getUser,informData,informCreate,lineNotify } = require('../../../models/InformService')
const moment = require('moment');
const { formatDate } = require('../../../helpers');

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

module.exports = {
    getInformData,
    sendLineNotify,
}