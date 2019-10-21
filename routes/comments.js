var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//Comments Create
// @todo send added comment as response instead of redirecting to campgrounds view
router.post("/",isLoggedIn,function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.send({success: false, err});
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
               res.send({success: false, err});
           } else {
               campground.comments.push(comment);
               campground.save();
               res.send({success: true, comment});
           }
        });
       }
   });
});

router.delete("/:commentId",isLoggedIn,function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err){
        if(err){
            res.send({success: false, err});
        }else{
            Campground.find({}, function(err, campgrounds) {
              campgrounds.forEach(campground => {
                let index = campground.comments.indexOf(req.params.commentId);
                if(index !== -1)
                  campground.comments.splice(index, 1)
                  campground.save()
              })
            })
            res.send({success: true, message: 'Successfully deleted campground!'});
        }
    });
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.send({success: false, message: 'Please log in to enjoy our services!'});
}


module.exports = router;
