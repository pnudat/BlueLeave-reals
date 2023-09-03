const express = require('express');
const bodyParser = require('body-parser');
const paths = require('./routes');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/leavepolicy', express.static('src'));
app.use(cors())

app.use('/api', paths);
app.use('*',(req, res, ) =>{
    res.json({massage: 'url not found'});
})

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});