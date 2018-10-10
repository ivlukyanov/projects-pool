var express = require('express'),
    router = express.Router(),
    debug = require('debug')('pool:index');

router.get('/', function (req, res, next) {
    debug(' --- MODE: ', req.app.get('env'));
    debug(' --- PRETTY: ', req.app.locals.pretty);
    res.render('index');
});

router.get('/about', function (req, res, next) {
    res.render('about');
});

module.exports = router;