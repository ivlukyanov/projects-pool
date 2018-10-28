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
    auth.authenticate(req.body.login.trim(), req.body.password.trim(), function (err, user) {
        if (err) {
            req.session.error = err.message;
            res.redirect('/login');
        } else {
            // Regenerate session when signing in to prevent fixation
            req.session.regenerate(function () {
                // Store the user object in the session store to be retrieved
                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.name;
                res.redirect('/projects/my');
            })
        }
    });
});



// Show register form
router.get('/register', auth.guestonly, function (req, res) {
    res.render('registerForm', { data: [], title: 'Projects pool :: Register', });
});

// Parse register form
router.post('/register', (req, res) => {
    const filesArr = [
        { name: 'prjPresentationFile', maxCount: 1 },
        { name: 'prjWhitePaperFile', maxCount: 1 },
        { name: 'prjLogoFile', maxCount: 1 },
        { name: 'prjCoverImgFile', maxCount: 1 },
    ];
    Promise.all([
        upload.file.fields(filesArr)(req, res, (err) => {
            if (err) throw err;
        })
    ]).then((values) => {
        let user = new models.User({
            name: req.body.userName,
            surname: req.body.userSurName,
            email: req.body.userEmail,
            password: req.body.userPassword,
        });
        let project = new models.Project({
            name: req.body.prjName,
            url: req.body.prjUrl,
            descript: req.body.prjDescript,
            stack: req.body.prjStack,
            needs: req.body.prjNeeds,
            capabilities: req.body.prjCapabilities,
            logoFile: req.body.prjLogoFile,
            owner: user._id,
        })
        return Promise.all([
            user.save(),
            project.save(),
        ])
    }).then((values) => {
        req.session.regenerate(function () {
            var user = values[0];
            var project = values[1];
            req.session.success = 'Authenticated as ' + user.name;
            res.locals.session = req.session;
            res.render('projectView', { data: project, })
        })
    }).catch((err) => {
        res.render('registerForm', { error: err.message, data: req.body, title: 'Error' });
    })

    // if (err) {
    //     res.render('registerForm', { error: 'Ошибка загрузки файла: ' + err.message, data: req.body, title: 'Error' });
    // if (err) res.render('registerForm', { error: err.message, data: req.body, title: 'Error' })
    // prjLogoFile = (req.files.length) ? req.files[0].filename : '';
});

module.exports = router;
