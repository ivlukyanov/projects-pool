var express = require('express'),
    router = express.Router(),
    debug = require('debug')('pool:projects'),
    models = require('../models'),
    upload = require('../upload.js');

// All projects
router.get('/', (req, res) => {
    models.Project.find({}, { _id: 1, prjLogo: 1, prjName: 1, prjUrl: 1, prjLeader: 1 }).lean().exec((err, projects) => {
        if (err) throw err;
        debug('FOUND ALL: ', JSON.stringify(projects));
        res.render('projects', { data: projects, });
    });
});

// Show register form
router.get('/register', (req, res) => {
    res.render('register', { data: [] });
});

// Parse register form
router.post('/register', (req, res) => {
    debug('BODY: ' + JSON.stringify(req.body));
    let project = new models.Project(req.body);
    project.save((err, createdProject) => {
        if (err) {
            //todo: валидация
            debug('NOT SAVED: ', JSON.stringify(err));
            res.render('register', { data: req.body, });
        }
        else {
            debug('SAVED ONE: ', JSON.stringify(createdProject));
            res.render('project', { data: createdProject, })
        }
    });
});

// Get project
router.get('/:id', (req, res) => {
    models.Project.findOne({ _id: req.params.id }).lean().exec((err, project) => {
        if (err || !project) {
            debug('NOT FOUND: ', err ? err.message : req.params.id);
            res.render('project', { error: 'Проект не найден', });
        }
        else {
            debug('FOUND ONE: ', project);
            res.render('project', { data: project, });
        }
    });
});

// Edit project
router.get('/:id/edit', (req, res) => {
    models.Project.findOne({ _id: req.params.id }).lean().exec((err, project) => {
        if (err || !project) {
            debug('NOT FOUND: ', err ? err.message : req.params._id);
            res.render('project', { error: 'Проект не найден', });
        }
        else {
            debug('FOUND ONE: ', JSON.stringify(project));
            res.render('register', { data: project, });
        }
    });
});

// Save project
router.post('/:id/edit', (req, res) => {
    debug('BODY: ' + JSON.stringify(req.body));
    // todo: validate id https://code-examples.net/en/q/e3f9f4

    upload.single('prjLogo')(req, res, err => {
        if (err || !req.file) {
            debug('FILE UPLOAD ERROR: ', err ? err.message : 'UNKNOWN');
            debug('!!! FILE SAVED !!!');
            console.log('ONE FILE: ', req.file);
            console.log('ARRAY OF FILES: ', req.files);
            res.render('project', { error: err && err.code === 'LIMIT_FIELD_VALUE' ? 'Превышен лимит файла' : 'Ошибка загрузки файла', });
        } else {
            req.body.prjLogo = req.file.filename;
            models.Project.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, strict: false }).lean().exec((err, project) => {
                if (err || !project) {
                    // todo: валидация
                    debug('NOT FOUND: ', err ? err.message : req.params._id);
                    res.render('project', { error: 'Проект не найден!' + err.message, });
                }
                else {
                    debug('--- MONGO NEW FIELD: ' + project.prjLogo)
                    debug('SAVED: ', JSON.stringify(project._id));
                    res.render('project', { data: project, });
                }
            });
        }
    });
});

module.exports = router;