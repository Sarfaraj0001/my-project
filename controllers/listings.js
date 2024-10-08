const { models, model } = require("mongoose");
const Listing = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({}).populate("owner");
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const singleList = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!singleList) {
        req.flash("error", "Listing you requested does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { singleList });
}

module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
        .send()
    let url = req.file.path;
    let filename = req.file.filename;
    let listing = req.body.listing;
    let newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    // console.log(savedListing)
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = req.body.listing;
    let UpdatedListing = await Listing.findByIdAndUpdate(id, listing, { new: true });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        UpdatedListing.image = { url, filename }
        await UpdatedListing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}