const express = require('express');

const User = require('../models/user');

const router = express.Router();

// Handle sign up
router.post('/signup', async (req, res) => {
  let user = User.findOne({ username: req.body.username });
  if (!user) {
    user = new User({ username: req.body.username });
    await user.setPassword(req.body.password);
    await user.save();
  }

  const { user: loggedInUser, error } = await User.authenticate()(
    req.body.username,
    req.body.password
  );
  if (error) {
    return res.status(403).send({ success: false, message: error.message });
  }

  res.send({ success: true, username: loggedInUser.username });
});

router.get('/', (req, res) => {
  res.send('Hello bot!!');
});

// Handling login
router.post('/login', async (req, res) => {
  const { user, error } = await User.authenticate()(
    req.body.username,
    req.body.password
  );
  if (error) {
    return res.status(403).send({ success: false, message: error.message });
  }

  res.send({ success: true, username: user.username });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.send({ success: true, message: 'Successfully logged out!' });
});

router.get('/authorized', (req, res) => {
  res.send({ isLoggedIn: req.isAuthenticated() });
});

module.exports = router;
