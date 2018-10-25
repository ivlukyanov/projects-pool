var mongoose = require('mongoose')
	, crypto = require('crypto');

let UserSchema = new mongoose.Schema({
	// owner: ObjectId,
	// _id: mongoose.Schema.Types.ObjectId,
	// prjName: { type: String, required: [true, "Title required"], minlength: [6, "Too short"], unique: true, },
	name: { type: String, required: true },
	surname: { type: String, required: true },
	email: { type: String, required: true },
	hashedPassword: { type: String, required: true },
	salt: { type: String, required: true },
	photoFile: String,
	phone: String,
	telegram: String,
	facebook: String,
	bio: String,
	role: { type: String, default: 'SEO' },
	created: { type: Date, default: Date.now },
	modified: { type: Date, default: Date.now },
},
	{
		versionKey: false,
		toJSON: {
			virtuals: true
		}
	}
);

UserSchema.methods = {
	encryptPassword : function (password) {
		// return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
		return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
	},
	checkPassword : function (password) {
		return this.encryptPassword(password) === this.hashedPassword;
	}
}

UserSchema.virtual('password')
	.set(function (password) {
		this._plainPassword = password;
		this.salt = Math.random() + '';
		this.hashedPassword = this.encryptPassword(password);
	})
	.get(function () {
		return this._plainPassword;
	})

UserSchema.virtual('fullname')
	.get(function () {
		return this.name + ' ' + this.surname;
	})


module.exports = mongoose.model('User', UserSchema);