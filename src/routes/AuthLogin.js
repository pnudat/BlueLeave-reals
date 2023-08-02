const express = require('express');
const {
    bindToLDAPServer,
    FindUser
} = require('../controllers/ServiceLogin');
const jwt = require('jsonwebtoken');
const {
    Config
} = require('../config/Index');

const router = express.Router();

router.post('/login', async (req, res) => {
    // console.log(req.body);

    const username = req.body.username;
    const password = req.body.password;

    if (username == '' || username == undefined) {
        return res.status(401).send('Username is required');
    } else if (password == '' || password == undefined) {
        return res.status(401).send('Password is required');
    }

    // Find and get ou user
    FindUser(username, (err, data) => {
        if (err) {
            console.log('Error retrieving OUs:', err);
            res.status(401).send('Error retrieving OUs');
        } else {
            bindToLDAPServer(username, password, data[0])
                .then(() => {
                    console.log('Successfully bound to server');

                    const token = jwt.sign({
                        username: username,
                    }, Config.secret_key, {
                        expiresIn: '10m'
                    });
                    // console.log({token: token});
                    res.send({
                        token
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