const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const reviewController = require("../controllers/reviews")
const {
  isLoggedIn,
  validateReview,
  isOwner
} = require("../middleware");

// =========================
// CREATE REVIEW
// =========================
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// =========================
// DELETE REVIEW (ONLY LISTING OWNER)
// =========================
router.delete(
  "/:reviewId",
  isLoggedIn,
  isOwner, // 🔐 ONLY OWNER CAN DELETE
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
