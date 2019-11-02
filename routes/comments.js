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
            let comment = {text: req.body.comment, author: req.user.username}
            Comment.create(comment, function(err, comment){
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
    Comment.findById(req.params.commentId, function(err, comment){
        if(err){
            res.send({success: false, err});
        }else{
            if(comment.author === req.user.username) {
                Comment.deleteOne({_id: req.params.commentId}, function(err) {
                    if(err) {
                        console.log('here')
                        res.status(400).send({
                            success: false,
                            err
                        })
                    } else {
                        Campground.find({}, function(_err, campgrounds) {
                          campgrounds.forEach(campground => {
                            let index = campground.comments.indexOf(req.params.commentId);
                            if(index !== -1)
                              campground.comments.splice(index, 1)
                              campground.save()
                          })
                        })
                        res.status(200).send({success: true, message: 'Successfully deleted campground!'});
                    }
                })
            } else {                
                res.status(401).send({
                    success: false,
                    message: 'You can only delete your own comments :/'
                })
            }
        }
    });
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.send({success: false, isLoggedIn: false, message: 'Please log in to enjoy our services!'});
}


module.exports = router;
