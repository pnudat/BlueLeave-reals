const { connectLdap, FindUser } = require('../../models/LoginService');
const jwt = require('jsonwebtoken');
const { Key } = require('../../configs');

async function authenticate(req, res) {
    try {
        const username = req.body.username;
        const password = req.body.password;

        if (!username) {
            return res.status(401).send('Username is required');
        } else if (!password) {
            return res.status(401).send('Password is required');
        }
        FindUser(username, (err, data) => {
            if (err) {
                console.log('Error retrieving user data:', err);
                return res.status(500).send('Error retrieving user data');
            } else {
                connectLdap(username, password, data[0])
                    .then(() => {
                        console.log('Successfully authenticated');
                        const token = jwt.sign(
                            { username: username },
                            Key.secret_key,
                            { expiresIn: '5d' }
                        );

                        return res.send({ token });
                    })
                    .catch((error) => {
                        console.log('Error:', error);
                        return res.status(401).send('Authentication failed');
                    });
            }
        });
    } catch (error) {
        console.log('Error:', error);
        return res.status(500).send('Internal server error');
    }
}

module.exports = authenticate;