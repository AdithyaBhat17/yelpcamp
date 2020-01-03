const express = require('express');
const passport = require('passport');

const User = require('../models/user');

const router = express.Router();

// Handle sign up logic
router.post('/signup', async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).send({ success: false, message: 'Something went wrong.' });
  }
});

router.get('/', (req, res) => {
  res.send('Hello bot!!');
});

// Handling login
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.send({ success: true, username: req.user.username });
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
