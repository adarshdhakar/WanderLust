const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String, 
    image: {
        type: String,
        default: "https://unsplash.com/photos/a-beach-with-rocks-and-trees-Jg3vgxzhH4o",
        set: (v) => v === "" ? "https://unsplash.com/photos/a-beach-with-rocks-and-trees-Jg3vgxzhH4o" : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;