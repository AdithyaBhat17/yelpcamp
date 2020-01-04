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

// Logging for unhandled exceptions outside express
require('./services/logging')();

// Exit if no config set
require('./services/config')();

// Database connection
require('./services/db')();

// App middlewares
if (process.env.NODE_ENV === 'production') {
  // Production only middlewares
  require('./services/prod')(app);
}
require('./services/routes')(app);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('YelpCamp server is listening on port ' + port);
});
