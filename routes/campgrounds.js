var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
//const campground = require("../models/campground");

// INDEX - Show all Campgrounds
router.get("/", function (req, res) {
  // GET ALL CAMPGROUNDS FROM DATABASE
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campgrounds: allCampgrounds,
      });
    }
  });
});

// CREATE - Creates a new campground in the Database
router.post("/", middleware.isLoggedIn, function (req, res) {
  // Get data from form and add to campgrounds array
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username,
  };
  var newCampground = {
    name: name,
    price: price,
    image: image,
    description: desc,
    author: author,
  };
  // Create a new campground and save to database
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      // Redirect back to campgrounds page
      console.log(newlyCreated);
      res.redirect("/campgrounds");
    }
  });
});

// NEW - Shows form to create new campground
router.get("/new", middleware.isLoggedIn, function (req, res) {
  res.render("campgrounds/new");
});

// SHOW - Shows more info about one campground
router.get("/:id", function (req, res) {
  // Find the campground with provided ID
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        //console.log(foundCampground);
        // Render Show template with that campground
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

// EDIT - Edit Campground Form
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (
  req,
  res
) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});

// UPDATE - Where the Edit Campground Form submits
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  // Find and Update the correct Campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (
    err,
    updatedCampground
  ) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      // Redirect
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// DESTROY - Deletes an Existing Campground
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
