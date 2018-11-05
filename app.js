const createError = require('http-errors')
    , express = require('express')
    , logger = require('morgan')
    , db = require('./db.js')
    , session = require('express-session')
    , fileUpload = require('express-fileupload')

    , indexRouter = require('./routes/index')
    , usersRouter = require('./routes/users')
    , projectsRouter = require('./routes/projects')

    , app = express()

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// dev options 
if (app.get('env').trim() == 'development') {
    app.locals.pretty = true;
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(cookieParser());
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: '9nnbUSngV{f{z5zF2KLJJde*Cbx8m@sp',
    cookie: {
        maxAge: 7 * 24 * 3600 * 1000,
    }
}));
// Session-persisted message middleware
app.use(function (req, res, next) {
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = err || msg || '';
    res.locals.session = req.session;
    next();
});
app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 },
    createParentPath: true,
    preserveExtension: 5,
    abortOnLimit: true,
    safeFileNames: false,
}));
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
