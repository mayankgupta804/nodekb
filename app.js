const express = require('express');
const bodyParser = require('body-parser');
//init app
const app = express();

//Bring in models
let Article = require('./models/article');

const port = 3000;
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//check for connection
db.once('open', () => console.log('Connected to Mongodb...'));
//check for db errors
db.on('error', (err) => console.log(err));
//load view engine
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body parser middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended:false }));
//parse application/json
app.use(bodyParser.json());

//Set Public folder
app.use(express.static(path.join(__dirname, 'public')));

//home route
app.get('/', (req, res) => {
    let articles = Article.find({}, (err, articles) => {
        if(err){
            console.log(err);
        } else {
        res.render('index', {
            title: 'Articles',
            articles: articles
            });
        }
    });
});

//Get single article
app.get('/article/:id', function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        res.render('article', {
            article:article
        });
    });
});

//Load edit form
app.get('/articles/edit/:id', function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        res.render('edit_article', {
            title: 'Edit Title',
            article:article
        });
    });
});

//Update submit POST request
app.post('/articles/edit/:id', function(req, res){
    let article = {}
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id};

    Article.update(query, article, function(err) {
        if(err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });    
});

//Add route
app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title:'Articles'
    });
});

//Add submit POST route
app.post('/articles/add', (req, res) => {
    let article = new Article();
    article.title = req.body.title
    article.author = req.body.author
    article.body = req.body.body

    article.insertOne(function(err){
        if(err) {
            console.log(err)
            return;
        } else {
            res.redirect('/');
        }
    })
});

app.delete('/article/:id', function(req, res) {
    let query = {_id:req.params.id}

    Article.remove(query, function(err) {
        if(err) {
            console.log(err);
        }
        res.send('Success');
    });
});

//Add GET contact route
app.get('/contact', (req, res) => {
    res.render('contact')
});

//start server
app.listen(port, () => console.log("Server started on port : " +port));