var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"), // using to support PUT method.
    // passportLocalMongoose = require("passport-local-mongoose"),
    // Campground  = require("./models/campground"),
    // Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");

var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");

// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://AdithyaBhat:Rusty@ds111476.mlab.com:11476/yelpcamp_adithya", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// seedDB(); // use this to fill your db with default data.

//passport config

app.use(require("express-session")({
    secret:"Puta Madrid",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(methodOverride("_method"));

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);




app.listen(process.env.PORT || 8080, function(){
   console.log("The YelpCamp Server Has Started!");
});
