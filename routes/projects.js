var express = require('express'),
    router = express.Router(),
    debug = require('debug')('pool:projects'),
    models = require('../models'),
    upload = require('../upload.js');

// Get all projects
router.get('/', (req, res) => {
    models.Project.find({}, { _id: 1, logoFile: 1, name: 1, url: 1, leader: 1 }).lean().exec((err, projects) => {
        // todo: обработка ошибки mongo
        res.render('projectList', {
            data: projects,
            title: 'Projects pool :: All',
        });
    });
});

// Show project creating form
router.get('/create', (req, res) => {
    res.render('projectForm', {
        data: [],
        title: 'Projects pool :: Create',
    });
});

// Parse project creating form
router.post('/create', (req, res) => {
    let project = new models.Project(req.body);
    project.save((err, createdProject) => {
        if (err) {
            //todo: валидация
            res.render('projectForm', { error: err.message, data: req.body, title: 'Error'});
        }
        else {
            res.render('projectView', { data: createdProject, })
        }
    });
});

// Get one project
router.get('/:id', (req, res) => {
    models.Project.findOne({ _id: req.params.id }).lean().exec((err, project) => {
        if (err || !project) {
            res.render('projectView', { error: 'Проект не найден', title: 'Error' });
        }
        else {
            res.render('projectView', { data: project, });
        }
    });
});

// Show edit form
router.get('/:id/edit', (req, res) => {
    models.Project.findOne({ _id: req.params.id }).lean().exec((err, project) => {
        if (err || !project) {
            res.render('projectForm', { error: 'Проект не найден', title: 'Error' });
        }
        else {
            res.render('projectForm', { data: project, });
        }
    });
});

// Save one project
router.post('/:id/edit', (req, res) => {
    // todo: validate id https://code-examples.net/en/q/e3f9f4

    upload.img.array('logoFile', 1)(req, res, err => {
        if (err) {
            switch (err.code) {
                case 'LIMIT_FIELD_VALUE':
                    errMessage = 'Превышен лимит файла';
                    break;
                default:
                    errMessage = 'Ошибка загрузки файла';
            }
            res.render('projectForm', { error: errMessage, title: 'Error' });
        } else {
            req.body.logoFile = req.files[0].filename;
            models.Project.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, strict: false }).lean().exec((err, project) => {
                if (err || !project) {
                    // todo: валидация
                    res.render('projectForm', { error: 'Ошибка базы данных!' + err.message, title: 'Error' });
                }
                else {
                    res.render('projectForm', { data: project, });
                }
            });
        }
    });
});

module.exports = router;