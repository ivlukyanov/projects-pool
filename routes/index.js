var express = require('express')
    , router = express.Router()
    , debug = require('debug')('pool:index')
    , models = require('../models')
    , upload = require('../upload.js')
    , auth = require('../auth.js')

router.get('/', function (req, res, next) {
    debug(' --- MODE: ', req.app.get('env'));
    debug(' --- PRETTY: ', req.app.locals.pretty);
    res.render('index', { title: 'Projects pool :: Hello' });
});

router.get('/about', function (req, res, next) {
    res.render('about', { title: 'Projects pool :: About' });
});

router.get('/logout', function (req, res) {
    req.session.destroy(function () {
        res.redirect('/');
    });
});

router.get('/login', function (req, res) {
    res.render('login');
});

router.post('/login', function (req, res) {
    auth.authenticate(req.body.login, req.body.password, function (err, user) {
        if (user) {
            // Regenerate session when signing in
            // to prevent fixation
            req.session.regenerate(function () {
                // Store the user's primary key
                // in the session store to be retrieved,
                // or in this case the entire user object
                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.name
                    + ' click to <a href="/logout">logout</a>. '
                    + ' You may now access <a href="/restricted">/restricted</a>.';
                res.redirect('back');
            });
        } else {
            req.session.error = 'Authentication failed, please check your '
                + ' username and password.';
            res.redirect('/login');
        }
    });
});



// Show register form
router.get('/register', function (req, res) {
    res.render('registerForm', { data: [], title: 'Projects pool :: Register', });
});

// Parse register form
router.post('/register', (req, res) => {
    upload.img.array('prjLogoFile', 1)(req, res, err => {
        if (err) {
            res.render('registerForm', { error: 'Ошибка загрузки файла: ' + err.message, data: req.body, title: 'Error' });
        } else {
            req.body.prjLogoFile = (req.files.length) ? req.files[0].filename : '';
            let user = new models.User({
                name: req.body.userName,
                surname: req.body.userSurName,
                email: req.body.userEmail,
                password: req.body.userPassword,
            });
            user.save((err, createdUser) => {
                if (err) res.render('registerForm', { error: err.message, data: req.body, title: 'Error' })
                else {
                    let project = new models.Project({
                        name: req.body.prjName,
                        url: req.body.prjUrl,
                        descript: req.body.prjDescript,
                        stack: req.body.prjStack,
                        needs: req.body.prjNeeds,
                        capabilities: req.body.prjCapabilities,
                        logoFile: req.body.prjLogoFile,
                    });
                    project.save((err, createdProject) => {
                        if (err) res.render('registerForm', { error: err.message, data: req.body, title: 'Error' });
                        else res.render('projectView', { data: createdProject, })
                    });
                }
            });
        }
    });
});

module.exports = router;
