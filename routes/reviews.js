const express = require("express");
const router = express.Router({mergeParams : true});
const List = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const {isLoggedin, validateReview, isAuthor} = require("../middleware.js");
const reviewController = require("../controller/reviews.js");

//adding review to database
router.post("/",isLoggedin,validateReview,wrapAsync(reviewController.addReview))
  
  //deleting a review.
router.delete("/:reviewId",isLoggedin,isAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;