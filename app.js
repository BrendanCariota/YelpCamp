/* 
RESTFUL ROUTES

name        url             verb        desc.
============================================================
INDEX      /dogs            GET         Display a list of all dogs
NEW        dogs/new         GET         Displays form to make a new dog
CREATE     /dogs            POST        Adds new dog to Database
SHOW       /dogs/:id        GET         Shows info about one dog
EDIT       /dogs/:id/edit   GET         Shows edit form for one dog
UPDATE     /dogs/:id        PUT         Updates one specific dog, redirects
DELETE     /dogs/:id        DELETE      Deletes spedific dog, redirects
*/

var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds");

// Requiring Routes
var commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  indexRoutes = require("./routes/index");

// Passport Configuration
app.use(
  require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB!"))
  .catch((error) => console.log(error.message));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
// Adds our CSS Stylesheet
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

// Passing to every template
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Uses the three files with our routes in them
app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT || 3000, function () {
  console.log("Server starting on Port 3000");
});
