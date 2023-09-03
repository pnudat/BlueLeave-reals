const getUsersData = require('./allusers');
const { getEmployeeID, updateRole } = require('./usersetting');
const { getAllLeaveTypes, createLeaveType, updateLeaveType, deleteLeaveType } = require('./leavetype');
const { allPublicHoliday, createPublicHoliday, updatePublicHoliday, deletePublicHoliday } = require('./public_holiday');
const { savePolicy, deletePolicy } = require('./leavepolicy');

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