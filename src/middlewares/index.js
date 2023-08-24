const { authenticate } = require('./Login');
const { VerifyToken } = require('./Auth');
const { upload } = require('./Upload');

module.exports = {
    authenticate,
    VerifyToken,
    upload,
}