var multer = require('multer'),
    path = require('path'),
    crypto = require('crypto'),

    upload = multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './public/upload')
            },
            filename: function (req, file, cb) {
                let customFileName = crypto.randomBytes(10).toString('hex');
                cb(null, customFileName + path.extname(file.originalname))
            }
        }),
        limits: {
            fieldNameSize: 100,
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
                // case 'application/octet-stream':
                // case 'application/vnd.microsoft.portable-executable':
                default:
                    cb(new multer.MulterError('Forbidden file type'))
            }
        }
    })

module.exports = upload;