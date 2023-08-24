const express = require('express');
const admin = require('../../controllers');
const { upload } = require('../../middlewares/Upload');

const routers = express.Router();

routers.get('/users', admin.dataForAdmin.getUsersData);
routers.get('/user/:EmployeeID', admin.dataForAdmin.getEmployeeID);
routers.put('/user/:EmployeeID', admin.dataForAdmin.updateRole);

routers.get('/leavetypes', admin.dataForAdmin.getAllLeaveTypes);
routers.post('/leavetypes', admin.dataForAdmin.createLeaveType);
routers.put('/leavetype/:leavetype_id', admin.dataForAdmin.updateLeaveType);
routers.delete('/leavetype/:leavetype_id', admin.dataForAdmin.deleteLeaveType);

routers.get('/policy', express.static('filePolicy'));
routers.post('/policy', upload,admin.dataForAdmin.savePolicy);
routers.delete('/policy/:policy_id', admin.dataForAdmin.deletePolicy);

module.exports = routers;