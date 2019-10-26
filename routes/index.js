var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

//handle sign up logic
// @todo change auth implementation
router.post("/signup", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            res.send({success: false, err});
        } else {
          passport.authenticate("local")(req, res, function(){
              res.send({success: true, username: req.body.username});
          });
        }
    });
});

//handling login logic
router.post("/login", passport.authenticate("local"), function(req, res){
  res.send({success: true, username: req.body.username})
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   res.send({success: true, message: 'Successfully Logged Out!'});
});

router.get('/authorized', function(req, res) {
    res.send({isLoggedIn: req.isAuthenticated()});
});

module.exports = router;
