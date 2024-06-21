const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));

//Root Route
app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

//Index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    // console.log(allListings);
    // res.send(allListings);
    res.render("listings/index.ejs", {allListings});
});

//Show Route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
})
//Test Route
app.get("/testListing", async (req, res) => {
    let sampleListing = new Listing({
        title: "My New Villa",
        description: "By the beach",
        price: 1200,
        location: "Calangute, Goa",
        country: "India",
    });

    await sampleListing.save();
    console.log("sample was saved");
    res.send(sampleListing);
}) 

app.listen(8080, () => {
    console.log("server is listening on port 8080");
})