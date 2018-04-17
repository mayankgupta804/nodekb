const express = require('express');
const router = express.Router();
//Bring in Article models
let Article = require('../models/article');

//Load edit form
router.get('/edit/:id', function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        res.render('edit_article', {
            title: 'Edit Title',
            article:article
        });
    });
});

//Update submit POST request
router.post('/edit/:id', function(req, res){
    let article = {}
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id};

    Article.update(query, article, function(err) {
        if(err) {
            console.log(err);
            req.flash('failure', 'Article not updated');
            return;
        } else {
            req.flash('success', 'Article updated');
            res.redirect('/');
        }
    });    
});

//Add route
router.get('/add', (req, res) => {
    res.render('add_article', {
        title:'Articles'
    });
});

//Add submit POST route
router.post('/add', (req, res) => {
    req.checkBody('title', 'title is required').notEmpty();
    req.checkBody('author', 'author is required').notEmpty();
    req.checkBody('body', 'body is required').notEmpty();

    //Get errors
    let errors = req.validationErrors();
    console.log(errors)
    if(errors) {
        res.render('add_article', {
            title: 'Add Article',
            errors:errors
        });
    } else {
        let article = new Article();
        article.title = req.body.title
        article.author = req.body.author
        article.body = req.body.body
    
        article.save(function(err){
            if(err) {
                console.log(err)
                return;
            } else {
                req.flash('success', 'Article added');
                // res.send('success');  //this line throws error on edge cases
                res.redirect('/');
            }
        });
    }
});

router.delete('/:id', function(req, res) {
    let query = {_id:req.params.id}

    Article.remove(query, function(err) {
        if(err) {
            console.log(err);
            req.flash('failed', 'Article not removed');
            return;
        } else {
            req.flash('success', 'Article removed');
            res.send('Success');
        }
    });
});

//Get single article
router.get('/:id', function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        res.render('article', {
            article:article
        });
    });
});

module.exports = router;
