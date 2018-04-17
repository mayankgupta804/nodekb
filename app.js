const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const connectFlash = require('connect-flash');
const session = require('express-session');
//init app
const app = express();

//Bring in models
let Article = require('./models/article');

const port = 3000;
const path = require('path');

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

//Express session middleware
app.use(session({
    secret:'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//Express Validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

        while(namespace.length) {
            formParam+= '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}))

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

//Add GET contact route
app.get('/contact', (req, res) => {
    res.render('contact')
});

//Route files
let articles = require('./routes/articles');
app.use('/articles', articles);

//start server
app.listen(port, () => console.log("Server started on port : " +port));