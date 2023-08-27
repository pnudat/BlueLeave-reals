const express = require('express');
const bodyParser = require('body-parser');
const path = require('./routes');
const cors = require('cors');

const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('/src/upload/filePolicy'));
app.use(cors())

app.use('/api', path);

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});