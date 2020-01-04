const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');
const mongoose = require('mongoose');

module.exports = function(app) {
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
  app.use(cors({ credentials: true, origin: process.env.BASE_URL }));
  app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection })
    })
  );
  app.use(methodOverride('_method'));

  require('./passport')(app);

  app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
  });

  // Register routes
  app.use('/', require('../routes/index'));
  app.use('/campgrounds', require('../routes/campgrounds'));
  app.use('/comments', require('../routes/comments'));

  // eslint-disable-next-line no-unused-vars
  app.use(function(err, req, res, next) {
    res.status(500).send({ success: false, message: err.message });
  });
};
