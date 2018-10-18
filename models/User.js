const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
    // owner: ObjectId,
    // _id: mongoose.Schema.Types.ObjectId,
    // prjName: { type: String, required: [true, "Title required"], minlength: [6, "Too short"], unique: true, },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    photoFile: String,
    phone: String,
    telegram: String,
    facebook: String,
    bio: String,
    role: { type: String, default: 'SEO' },
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now },
},
    { versionKey: false, }
);

module.exports = mongoose.model('User', UserSchema);