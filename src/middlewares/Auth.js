const jwt = require('jsonwebtoken');
const { Key } = require('../configs');

const VerifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['authorization'];

    if (!token) {
        return res.status(401).json({
            error: "No token provided"
        });
    }

    try {
        const bearerToken = token.startsWith('Bearer ') ? token.slice(7) : token;
        const decoded = jwt.verify(bearerToken, Key.secret_key);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            error: "Invalid token"
        });
    }
};

module.exports = {
    VerifyToken
};