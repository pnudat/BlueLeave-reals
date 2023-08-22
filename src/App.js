const express = require('express');
const bodyParser = require('body-parser');
const path = require('./routes');

const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/v1', path);

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});