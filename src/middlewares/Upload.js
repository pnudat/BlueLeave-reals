const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../upload/filePDF');
  },
  filename: (req, file, cb) => {
    cb(null, 'fileupload-' + Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage }).single('file')

module.exports = {
    upload
}