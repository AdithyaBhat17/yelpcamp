const mongoose = require('mongoose');

function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).send({
      success: false,
      isLoggedIn: false,
      message: 'Please log in to enjoy our services!'
    });
  }

  next();
}

function isValidId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send({ success: false, message: 'Invalid ID' });
  }

  next();
}

exports.isLoggedIn = isLoggedIn;
exports.isValidId = isValidId;
