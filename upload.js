const multer = require('multer'),
    path = require('path'),
    crypto = require('crypto'),
    fs = require('fs'),

    uploadFolder = './public/upload/',

    file = multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                filesFolder = uploadFolder + 'files';
                if (!fs.existsSync(filesFolder))
                    fs.mkdirSync(filesFolder);
                cb(null, filesFolder);
            },
            filename: function (req, file, cb) {
                let customFileName = crypto.randomBytes(10).toString('hex');
                cb(null, customFileName + path.extname(file.originalname))
            }
        }),
    }),

    img = multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './public/upload/img')
            },
            filename: function (req, file, cb) {
                let customFileName = crypto.randomBytes(10).toString('hex');
                // let customFileName = req.session.user._id + '_' + crypto.randomBytes(10).toString('hex');
                cb(null, customFileName + path.extname(file.originalname))
            }
        }),
        limits: {
            fieldSize: 10 * 1024 * 1024, // todo: не ограничивает
        },
        fileFilter: (req, file, cb) => {
            // todo: добавить проверку через "Magic byte" (file type)
            switch (file.mimetype) {
                case 'image/png':
                case 'image/jpg':
                case 'image/jpeg':
                    cb(null, true);
                    break;
                default:
                    cb(new Error('Forbidden file type'))
            }
        }
    }),

    doc = multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './public/upload/doc')
            },
            filename: function (req, file, cb) {
                let customFileName = crypto.randomBytes(10).toString('hex');
                cb(null, customFileName + path.extname(file.originalname))
            }
        }),
        limits: {
            fieldSize: 10 * 1024 * 1024, // todo: не ограничивает
        },
        fileFilter: (req, file, cb) => {
            // todo: добавить проверку через "Magic byte" (file type)
            switch (file.mimetype) {
                case 'application/pdf':
                case 'application/vnd.oasis.opendocument.text': // odf
                case 'application/vnd.oasis.opendocument.presentation': // odp
                case 'application/msword': // doc
                case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': // docx
                case 'application/vnd.ms-powerpoint': // ppt
                case 'application/vnd.openxmlformats-officedocument.presentationml.presentation': // pptx
                    cb(null, true);
                    break;
                default:
                    cb(new Error('Forbidden file type'))
            }
        }
    });

module.exports = {
    file: file,
    img: img,
    doc: doc
};