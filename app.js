require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
require('express-async-errors');
const expressSession = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const app = express();

// Database connection
require('./services/db')();

// App middlewares
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({ credentials: true, origin: process.env.BASE_URL }));
app.use(
  expressSession({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
);
app.use(methodOverride('_method'));

// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local
const User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// Register routes
app.use('/', require('./routes/index'));
app.use('/campgrounds', require('./routes/campgrounds'));
app.use('/comments', require('./routes/comments'));

app.use(function(err, req, res) {
  res.status(500).send({ success: false, message: err.message });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('YelpCamp server is listening on port ' + port);
});
