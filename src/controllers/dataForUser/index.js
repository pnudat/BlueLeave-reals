const { getInformData,sendLineNotify } = require('./informService');
const { allPublicHoliday } = require('./publicHoliday');

module.exports = {
    getInformData,
    sendLineNotify,
    allPublicHoliday,
}