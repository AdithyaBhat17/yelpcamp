require('dotenv').config()
var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
})

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, campgrounds){
       if(err){
           res.send({success: false, err});
       } else {
          res.send({success: true, campgrounds});
       }
    });
});

//CREATE - add new campground to DB
// @todo send response instead of redirecting to a view
router.post("/",isLoggedIn, async function(req, res) {
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var file = req.body.file;
    var price = req.body.price;
    var description = req.body.description;
    let image

    await cloudinary.uploader.upload(file, {folder: 'campgrounds'}, (error, result) => {
        if(error) {
            res.send({success: false, error})
        } else if(result && result.secure_url) {
            image = result.secure_url
        } else {
            res.send({success: false, message: 'Something went wrong while uploading files.. Try again!'})
        }
    })
    var newCampground = {name, image, price, description, author: req.user.username};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, campground){
        if(err){
          res.send({success: false, err});
        } else {
            res.send({success: true, campground});
        }
    });
});

//NEW - show form to create new campground
// @todo remove this route
router.get("/new",isLoggedIn, function(req, res){
   res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
        if(err){
            res.send({success: false, err});
        } else {
            //render show template with that campground
            res.send(campground);
        }
    });
});

//UPDATE
router.put("/:id",function(req, res){
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price};
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            res.send({success: false, err});
        }else{
            res.send({success: false, campground});
        }
    });
});

//DESTROY
router.delete("/:id/delete",isLoggedIn,function(req, res){
    Campground.findById(req.params.id, function(error, campground) {
        if(error)
            res.status(400).send({success: false, message: error.message})
        else {
            if(campground.author === req.user.username) {
                Campground.deleteOne({_id: req.params.id}, function(error) {
                    if(error) {
                        res.status(400).send({
                            success: false,
                            message: error.message
                        })
                    } else {
                        res.status(200).send({
                            success: true,
                            message: 'Successfully deleted ' + campground.name + '!'
                        })
                    }
                })
            } else {                
                res.status(401).send({
                    success: false,
                    message: 'You can only delete your own campgrounds :/'
                })
            }
        }
    })
});


//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.send({success: false, isLoggedIn: false, message: 'Please log in to enjoy our services!'});
}

module.exports = router;
