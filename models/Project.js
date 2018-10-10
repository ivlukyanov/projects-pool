const mongoose = require('mongoose');

let Images = new mongoose.Schema({
    kind: {
        type: String,
        enum: ['thumbnail', 'detail'],
        required: true
    },
    url: { type: String, required: true }
});

let ProjectSchema = new mongoose.Schema({
    // dateCreation: Date,
    // owner: ObjectId,
    prjId: mongoose.Schema.Types.ObjectId,
    // prjName: { type: String, required: [true, "Title required"], minlength: [6, "Too short"], unique: true, },
    prjName: {type: String, descr: 'Название'},
    prjUrl: String,
    prjDescript: String,
    prjLeader: String,
    prjlogo: String,
    prjCreated: { type: Date, default: Date.now },
    prjModified: { type: Date, default: Date.now },
    prjStack: String,
    prjCapabilities: String,
    prjNeeds: String,
},
    { versionKey: false, }
);

module.exports = mongoose.model('Project', ProjectSchema);