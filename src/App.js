const express = require('express');
const bodyParser = require('body-parser');
// const {
//     readdirSync
// } = require('fs');
// const router = require('./routes/users');
const auth = require('./routes/AuthLogin');
const users = require('./routes/GetAllUser');
const searchID = require('./routes/EditUser');


const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use('/api', auth)
app.use('/api', users)
app.use('/api', searchID)

// readdirSync('./src/routes').map((r) => app.use('/api', require('./src/routes/' + r)));

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});