var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

//handle sign up logic
// @todo change auth implementation
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            res.send({success: false, err});
        } else {
          passport.authenticate("local")(req, res, function(){
              res.send({success: true, err});
          });
        }
    });
});

//handling login logic
router.post("/login", passport.authenticate("local"), function(req, res){
  res.send({success: true, username: req.user.username})
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success","Logged you out");
   res.send({success: true});
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.send({success: false, err:{message: 'Please log in to continue'}});
}

module.exports = router;
