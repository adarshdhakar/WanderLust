const Listing = require("../models/listing");

module.exports.index = async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res, next) => {
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
}

module.exports.createListing = async(req, res, next) => {
    try {
        if(!req.body.listing){
            throw new ExpressError(400, "Send valid data for listing");
        }
        // let {title, description, image, price, country, location} = req.body;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        console.log(req.user);
        
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    }
    catch(err) {
        next(err);
    }
};

module.exports.renderEditForm = async (req, res, next) => {
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
};

module.exports.updateListing = async (req, res, next) => {
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data for listing");
    // }
    let {id} = req.params;    
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res, next) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};