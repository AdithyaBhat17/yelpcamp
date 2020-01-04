const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(app) {
  // Configure passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport-local
  const User = require('../models/user');
  passport.use(new LocalStrategy(User.authenticate()));

  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};
