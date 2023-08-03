const express = require('express');
const bodyParser = require('body-parser');
// const {
//     readdirSync
// } = require('fs');
// const router = require('./routes/users');
const Auth = require('./routes/Login');
const Users = require('./routes/AllUser');
const User = require('./routes/User');


const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use('/api', Auth)
app.use('/api', Users)
app.use('/api', User)

// readdirSync('./src/routes').map((r) => app.use('/api', require('./src/routes/' + r)));

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});