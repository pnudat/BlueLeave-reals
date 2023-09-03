const { getInformData,sendLineNotify } = require('./inform');
const { allPublicHoliday } = require('./public-holiday');

module.exports = {
    getInformData,
    sendLineNotify,
    allPublicHoliday,
}