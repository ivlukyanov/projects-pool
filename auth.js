var models = require('./models')

// Authenticate using our plain-object database of doom!
function authenticate(login, pass, fn) {
	models.User.findOne({ 'email': login }).exec((err, user) => {
		if (err || !user) fn(new Error('Cannot find user'));
		else if (user.checkPassword(pass)) fn(null, user)
		else fn(new Error('Invalid password'));
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

function guestonly(req, res, next) {
	if (!req.session.user) {
		next();
	} else {
		req.session.error = 'Only for new users!';
		res.redirect('/projects/my');
	}
}

module.exports = {
	authenticate: authenticate,
	restrict: restrict,
	guestonly: guestonly,
}