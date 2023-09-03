const { holidayData, holidayCreate, holidayUpdate, holidayDelete} = require('../../../models/publicHoliday');
const { holidayDate } = require('../../../helpers');

async function allPublicHoliday(req, res) { // Get all leave types
    try {
        const data = await holidayData();
        const mappedData = data.map(item => {
            return {
                date: holidayDate(item.holiday_date),
                description: item.description,
                status: item.status,
            };
        });

        res.status(200).json(mappedData);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function createPublicHoliday(req, res) { // Create a new leave type
    try {
        const holiday_date = req.body.holiday_date;
        const description = req.body.description;
        const status = req.body.status;
        if (status === 'active' || status === 'inactive') {
            const result = await holidayCreate(holiday_date, description, status);

            res.status(201).json({ message: result });
        } else {
            res.status(404).json({ message: 'Please enter the data correctly' });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updatePublicHoliday(req, res) {
    try {
        const holiday_id = req.params.holiday_id;
        const holiday_date = req.body.holiday_date;
        const description = req.body.description;
        const status = req.body.status;
        const result = await holidayUpdate(holiday_id, holiday_date, description, status);

        res.status(201).json({ message: result });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deletePublicHoliday(req, res) {
    try {
        const holiday_id = req.params.holiday_id;
        const result = await holidayDelete(holiday_id);

        res.status(200).json({ message: result });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    allPublicHoliday,
    createPublicHoliday,
    updatePublicHoliday,
    deletePublicHoliday
}