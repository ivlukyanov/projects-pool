const uploadFolder = './public/upload/'
    , path = require('path')
    , crypto = require('crypto')

// file has type of express-upload
async function saveFile(file, folder, prefix = '') {
    if (file) {
        file.name = prefix + '_' + crypto.createHmac('md5', file.name).digest('hex') + path.extname(file.name);
        await file.mv(uploadFolder + folder + '/' + file.name);
    } else {
        return false;
    }
}

async function saveFiles(filesArr) {
    for (item of filesArr) {
        await saveFile(item.file, item.folder, item.prefix)
    }
}

module.exports = {
    saveFile: saveFile,
    saveFiles: saveFiles,
}