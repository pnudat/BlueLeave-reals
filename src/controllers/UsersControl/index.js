const { getInformData,sendLineNotify } = require('./InformService');
const { allPublicHoliday } = require('./PublicHolidayService');

module.exports = {
    getInformData,
    sendLineNotify,
    allPublicHoliday,
}