const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

//Index Route
router.get("/", wrapAsync(async (req, res, next) => {
    const allListings = await Listing.find({});
    // console.log(allListings);
    // res.send(allListings);
    res.render("listings/index.ejs", {allListings});
}));

//New Route
router.get("/new", isLoggedIn, (req,res) => {
    console.log(req.user);
    res.render("listings/new.ejs");
});

//Create Route
router.post("/", isLoggedIn, validateListing, async(req, res, next) => {
    try {
        if(!req.body.listing){
            throw new ExpressError(400, "Send valid data for listing");
        }
        // let {title, description, image, price, country, location} = req.body;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        console.log(req.user);
        // if(!newListing.title){
        //     throw new ExpressError(400, "Title is missing");
        // }
        // if(!newListing.description){
        //     throw new ExpressError(400, "Description is missing");
        // }
        // if(!newListing.location){
        //     throw new ExpressError(400, "Location is missing");
        // }
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    }
    catch(err) {
        next(err);
    }
});

//Show Route
router.get("/:id", wrapAsync(async (req, res, next) => {
    let {id} = req.params;
    
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");
    
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
}));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, async (req, res, next) => {
    try {
        let {id} = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
            req.flash("error", "Listing you requested for does not exist!");
            res.redirect("/listings");
        }
        res.render("listings/edit.ejs", {listing});
    }
    catch (err) {
        next(err);
    }
});

//Update Route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res, next) => {
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data for listing");
    // }
    let {id} = req.params;    
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//Destroy Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res, next) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;