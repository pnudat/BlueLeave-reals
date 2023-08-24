const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const policyDir = './src/upload/filePolicy/';
        if (!fs.existsSync(policyDir)) {
            fs.mkdirSync(policyDir);
        }
        callback(null, policyDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'Policy' + uniqueSuffix + file.originalname)
      }
});

exports.upload = multer({ storage: storage }).single('file')
