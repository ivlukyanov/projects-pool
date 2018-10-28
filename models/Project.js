const mongoose = require('mongoose');

let TeamMembers = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    photoFile: { type: String, required: true },
    role: { type: String, required: true },
});

let RoadMap = new mongoose.Schema({
    task: { type: String, required: true, descr: 'Задача' },
    deadline: { type: Date, required: true },
    responsible: { type: String, required: true },
});

let ProjectSchema = new mongoose.Schema({
    // owner: ObjectId,
    // _id: mongoose.Schema.Types.ObjectId,
    // prjName: { type: String, required: [true, "Title required"], minlength: [6, "Too short"], unique: true, },
    name: { type: String, descr: 'Название' },
    url: String,
    descript: String,
    stack: String,
    capabilities: String,
    needs: String,
    members: [TeamMembers],
    roadmap: [RoadMap],
    logoFile: String,
    coverImgFile: String,
    presentationFile: String,
    whitePaperFile: String,
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},
    { versionKey: false, }
);

module.exports = mongoose.model('Project', ProjectSchema);