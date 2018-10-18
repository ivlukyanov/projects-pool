var hash = require('pbkdf2-password')()
	, models = require('./models')

// Authenticate using our plain-object database of doom!
function authenticate(login, pass, fn) {
	console.log('authenticating %s:%s', login, pass);
	models.User.findOne({ 'email': login }).lean().exec((err, user) => {
		if (err || !user) return fn(new Error('cannot find user'));
		hash({ password: pass, salt: user.salt }, function (err, pass, salt, hash) {
			if (err) return fn(err);
			if (hash === user.hash) return fn(null, user)
			fn(new Error('invalid password'));
		});
	})
}

function restrict(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		req.session.error = 'Access denied!';
		res.redirect('/login');
	}
}

module.exports = {
	authenticate: authenticate,
	restrict: restrict,
}