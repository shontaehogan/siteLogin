// ************PACKAGES***************

const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator')
const session = require('express-session');
const app = express();

// ************BOILER PLATE*****************

// for handlebars
app.engine('handlebars', expressHandlebars());
app.set('views', './views');
app.set('view engine', 'handlebars');


// for express-session
app.use(
  session({
    // fyi not the correct way to store passwords in the future, just for this lesson
    secret: 'mySecretPassword$',
    resave: false, //doesn't save without changes
    saveUninitialized: true //creates a session
  })
);

// for express
app.use(express.static('public'));

// for body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// for express-validator
app.use(expressValidator());


// **************SECURE DATABASE***********
// this will not be shown on the frontend
let topSecret = [{
    username: 'Shontae',
    password: '1977'
  },
  {
    username: 'Nyree',
    password: '2002'
  },
  {
    username: 'Christopher',
    password: '2013'
  }
];


// **************PAGES/ENDPOINTS***********

// path to home
app.get('/', function(req, res) {
  if (req.session.visitor) {
    res.redirect('/login')
  } else {
    res.render('home', {
      username: req.session.visitor
    });
  }
});

// path to login
app.get('/login', function(req, res) {
  res.render('login')
});

// send information after it is submitted
app.post('/login', function(req, res) {
  let user = req.body;


  // ************VALIDATION*************
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    // if there is an error print it
    res.render('login', {
      errors: errors
    });

    // if that user does not exist, return an error on the login page
  } else {
    let users = topSecret.filter(function(userCheck) {
      return userCheck.username === req.body.username;
    });

    // if that user does not exist, return an error on the login page
    if (users.length === 0) {
      let notAUser = "User not found. Please create an account."
      res.render('login', {
        NotAUserMsg: notAUser
      });
      return;
    }

    let user = users[0];

    // if the passwords match, direct user to the homepage
    if (user.password === req.body.password) {
      req.session.NotAUserMsg = user.username;
      res.redirect('/');
    } else {
      let notYourPassword = "Try again!"
      res.render('login', {
        NotAUserMsg: notYourPassword
      });
    }
  }
});



// **************LISTEN*************
app.listen(3000, function() {
  console.log('We ARE Good and running')
});
