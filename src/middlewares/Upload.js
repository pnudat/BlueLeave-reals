const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        // console.log(path.resolve);
        const policyDir = './src/upload/';
        if (!fs.existsSync(policyDir)) {
            fs.mkdirSync(policyDir);
        }
        callback(null, policyDir);
    },
    filename: function (req, file, cb) {
        cb(null, 'Policy' + file.originalname)
    }
});

exports.upload = multer({ storage: storage }).single('file')