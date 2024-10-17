const multer = require('multer');

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage }).fields([{ name: 'poster', maxCount: 1 }, { name: 'video', maxCount: 1 }]);

module.exports = upload;