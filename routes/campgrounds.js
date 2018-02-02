var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var geocoder = require("geocoder");

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

//CREATE - add new campground to DB
router.post("/",isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || data.status === 'ZERO_RESULTS') {
            req.flash('error', 'Invalid address, try typing a new address');
            return res.redirect('back');
        }
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newCampground = {name: name, image: image,price: price, description: desc, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
        Campground.create(newCampground, function(err, newlyCreated){
            if(err){
                console.log(err);
            } else {
                //redirect back to campgrounds page
                res.redirect("/campgrounds");
            }
        });
    });
});

//NEW - show form to create new campground
router.get("/new",isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT
router.get("/:id/edit",isLoggedIn, function(req, res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/edit",{campground:foundCampground});
        }
    });
    
});

//UPDATE
router.put("/:id",function(req, res){
    geocoder.geocode(req.body.campground.location, function (err, data) {
        if (err || data.status === 'ZERO_RESULTS') {
            req.flash('error', 'Invalid address, try typing a new address');
            return res.redirect('back');
        }
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address; 
        var newData = {name: req.body.campground.name, image: req.body.campground.image, description: req.body.campground.description, price: req.body.campground.price, location: location, lat: lat, lng: lng};
        Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err,campground){
            if(err){
                console.log(err);
            }else{
                req.flash("success","Successfully Updated!");
                res.redirect("/campgrounds/" + campground._id);
            }
        });
    });
});

//DESTROY
router.delete("/:id/delete",isLoggedIn,function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});


//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to that");
    res.redirect("/login");
}

module.exports = router;