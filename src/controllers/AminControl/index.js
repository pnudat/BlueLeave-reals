const getUsersData = require('./AllUserService');
const { getEmployeeID, updateRole } = require('./UserSettingService');
const { getAllLeaveTypes, createLeaveType, updateLeaveType, deleteLeaveType } = require('./LeaveTypeService');
const { allPublicHoliday, createPublicHoliday, updatePublicHoliday, deletePublicHoliday } = require('./PublicHoliday');
const { savePolicy, deletePolicy } = require('./LeavePolicyService');

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