const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middlewares/middleware.js");
const { index, renderNewForm, showListing, createListing, renderEditForm, updateListing, deleteListing } = require("../controllers/listings.js");
const multer = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })

router.route("/")
    //index Route
    .get(wrapAsync(index))
    //Create Route
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(createListing));

//New Route
router.get("/new", isLoggedIn, renderNewForm);

router.route("/:id")
    //Show Route
    .get(wrapAsync(showListing))
    // Update route after edit data
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(updateListing))
    // Delete route 
    .delete(isLoggedIn, isOwner, wrapAsync(deleteListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));

module.exports = router;