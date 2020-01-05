const compression = require('compression');
const helmet = require('helmet');
const logger = require('morgan');

module.exports = function(app) {
  app.use(logger('dev'));
  app.use(helmet());
  app.use(compression());
};
