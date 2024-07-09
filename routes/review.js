const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const  reviewController = require("../controllers/review.js");
const { validateReview, isLoggedIn ,isReviewOwner} = require("../middleware.js");

// Post review route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.postReview));

// Delete review route
router.delete("/:reviewId",  isLoggedIn, isReviewOwner,wrapAsync(reviewController.deleteReview));

module.exports = router;
