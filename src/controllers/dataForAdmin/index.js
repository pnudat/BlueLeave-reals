const { getUsersData } = require('./allUsers');
const { getEmployeeID,updateRole } = require('./userSetting');
const { getAllLeaveTypes,createLeaveType,updateLeaveType,deleteLeaveType } = require('./leaveType');

module.exports = {
    getUsersData,
    getEmployeeID,
    updateRole,
    getAllLeaveTypes,
    createLeaveType,
    updateLeaveType,
    deleteLeaveType
};