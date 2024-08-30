const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviewSchema.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middlewares/middleware.js");
const { createReview, deleteReview } = require("../controllers/reviews.js");

// Reviews
// Post Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

// Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(deleteReview))

module.exports = router;