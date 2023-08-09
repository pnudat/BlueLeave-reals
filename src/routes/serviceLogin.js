const express = require('express');
const router = express.Router();
const {
    connectLdap,
    FindUser
} = require('../controllers/serviceLogin');
const jwt = require('jsonwebtoken');
const {
    Config
} = require('../config/configData');

router.post('/login', async (req, res) => {     // res Authorization by username and password 
    // console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;

    if (username == '' || username == undefined) {
        return res.status(401).send('Username is required');
    } else if (password == '' || password == undefined) {
        return res.status(401).send('Password is required');
    }
    FindUser(username, (err, data) => {     // find user by username in database
        if (err) {
            console.log('Error retrieving OUs:', err);
            res.status(401).send('Error retrieving OUs');
        } else {
            connectLdap(username, password, data[0])    // connect to server
                .then(() => {
                    console.log('Successfully bound to server');

                    const token = jwt.sign({
                        username: username,
                    }, Config.secret_key, {
                        expiresIn: '5m'
                    });

                    res.send({
                        token   // res token
                    });

                })
                .catch((error) => {
                    console.log('Error:', error);
                    res.status(400).send('Authentication failed');
                });
        }
    });
});

module.exports = router;