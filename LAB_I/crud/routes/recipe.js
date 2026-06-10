var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/', (req, res) => {
    var recipes = db.prepare('SELECT * FROM recipe').all();
    res.render('recipe/index', { recipes });
});

router.get('/create', (req, res) => res.render('recipe/create'));

router.post('/create', (req, res) => {
    var { name, steps, ingredients } = req.body;
    db.prepare('INSERT INTO recipe (name, steps, ingredients) VALUES (?, ?, ?)').run(name, steps, ingredients);
    res.redirect('/recipe');
});

router.get('/:id', (req, res) => {
    var recipe = db.prepare('SELECT * FROM recipe WHERE id = ?').get(req.params.id);
    if (!recipe) return res.status(404).send('Not found');
    res.render('recipe/show', { recipe });
});

router.get('/:id/edit', (req, res) => {
    var recipe = db.prepare('SELECT * FROM recipe WHERE id = ?').get(req.params.id);
    res.render('recipe/edit', { recipe });
});

router.post('/:id/edit', (req, res) => {
    var { name, steps, ingredients } = req.body;
    db.prepare('UPDATE recipe SET name=?, steps=?, ingredients=? WHERE id=?').run(name, steps, ingredients, req.params.id);
    res.redirect('/recipe');
});

router.post('/:id/delete', (req, res) => {
    db.prepare('DELETE FROM recipe WHERE id = ?').run(req.params.id);
    res.redirect('/recipe');
});

module.exports = router;