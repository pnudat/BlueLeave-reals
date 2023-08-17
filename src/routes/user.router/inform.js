const express = require('express');
const moment = require('moment');

const routers = express.Router();

routers.get('/inform/:id', async (req, res) => {
    const EmployeeID = req.params.id;
    
    try {
        const data = await informData(EmployeeID);

        const formattedData = data.map(item => ({
            ...item,
            inform_date: moment(item.inform_date).format('DD/MM/YYYY')
        }));

        res.status(200).json(formattedData);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});



routers.post('/inform/:id', async (req, res) => {
    const EmployeeID = req.params.id;
    const informDate = req.body.informDate;
    const informType = req.body.informType;
    const description = req.body.description;

    if (informType === 'ทำงานนอกสถานที่' || informType === 'เข้างานสาย') {
        try {
            const employeeData = await fetchEmployeeFromLDAP(EmployeeID);

            if (employeeData.length > 0) {
                const employeeInfo = employeeData[0];
                const ldapName = { name: `${employeeInfo.attributes.find(attr => attr.type === "cn")?.values[0]} ${employeeInfo.attributes.find(attr => attr.type === "sn")?.values[0]}` };
                const ldapNameString = ldapName.name;
                // console.log(ldapNameString);
                const dateData = await formatDate(informDate);
                await informCreate(EmployeeID, dateData, informType, description)
                await sendLineNotify(ldapNameString, informDate, informType, description);

                res.status(200).json({ message: 'Line Notify sent successfully' });
            } else {
                res.status(404).json({ error: 'Employee not found in LDAP' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to send Line Notify' });
        }
    } else {
        res.status(400).json({ error: 'Invalid informType value' });
    }
});

module.exports = routers;