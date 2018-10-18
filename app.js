var createError = require('http-errors')
    , express = require('express')
    , cookieParser = require('cookie-parser')
    , logger = require('morgan')
    , db = require('./db.js')
    , hash = require('pbkdf2-password')()
    , session = require('express-session')

    , indexRouter = require('./routes/index')
    , usersRouter = require('./routes/users')
    , projectsRouter = require('./routes/projects')

    , app = express()

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// dev options 
if (app.get('env') == 'development') {
    app.locals.pretty = true;
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'very strong secret line'
}));
// Session-persisted message middleware
app.use(function (req, res, next) {
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});
app.use(express.static(__dirname + '/public'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('_error');
});

module.exports = app;
