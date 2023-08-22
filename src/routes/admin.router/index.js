const express = require('express');
const admin = require('../../controllers');

const routers = express.Router();

routers.get('/users', admin.dataForAdmin.getUsersData);
routers.get('/user/:EmployeeID', admin.dataForAdmin.getEmployeeID);
routers.put('/user/:EmployeeID', admin.dataForAdmin.updateRole);

routers.get('/leavetypes', admin.dataForAdmin.getAllLeaveTypes);
routers.post('/leavetypes', admin.dataForAdmin.createLeaveType);
routers.put('/leavetype/:leavetype_id', admin.dataForAdmin.updateLeaveType);
routers.delete('/leavetype/:leavetype_id', admin.dataForAdmin.deleteLeaveType);

module.exports = routers;