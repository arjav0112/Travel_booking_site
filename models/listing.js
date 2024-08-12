const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")
const User = require("./user.js");

const listing = new mongoose.Schema({
    title: {
        type : String,
        
    },
    description: {
        type:String,
       
    },
    image: {
        url:String,
        filename:String,
    },
    price : {
        type : Number,
        
    },
    location : {
        type : String,
        
    },
    country: {
        type : String,
        
    },
    review:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner : {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

listing.post("findOneAndDelete",async (listing) => {
    if(listing){
        await Review.deleteMany({_id: { $in : listing.review}});
    }
})

const List = mongoose.model("List",listing);

module.exports = List;