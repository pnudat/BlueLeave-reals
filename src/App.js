const express = require('express');
const bodyParser = require('body-parser');
// const {
//     readdirSync
// } = require('fs');
// const router = require('./routes/users');
const Auth = require('./routes/serviceLogin');
const Users = require('./routes/allUsers');
const User = require('./routes/userSetting');
const LeaveType = require('./routes/leaveType');


const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use('/api', Auth)
app.use('/api', Users)
app.use('/api', User)
app.use('/api', LeaveType)

// readdirSync('./src/routes').map((r) => app.use('/api', require('./src/routes/' + r)));

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});