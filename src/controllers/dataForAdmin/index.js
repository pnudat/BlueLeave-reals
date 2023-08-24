const { getUsersData } = require('./allUsers');
const { getEmployeeID,updateRole } = require('./userSetting');
const { getAllLeaveTypes,createLeaveType,updateLeaveType,deleteLeaveType } = require('./leaveType');
const { allPublicHoliday,createPublicHoliday,updatePublicHoliday,deletePublicHoliday } = require('./publicHoliday');
const { savePolicy,deletePolicy } = require('./leavePolicy');

module.exports = {
    getUsersData,
    getEmployeeID,
    updateRole,
    getAllLeaveTypes,
    createLeaveType,
    updateLeaveType,
    deleteLeaveType,
    allPublicHoliday,
    createPublicHoliday,
    updatePublicHoliday,
    deletePublicHoliday,
    savePolicy,
    deletePolicy
};