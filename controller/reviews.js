const Review = require("../models/review.js")
const List = require("../models/listing.js")

module.exports.addReview = async (req,res)=>{
    let id = req.params.id;
    // console.log(req.body);
    let {comment,rating}=req.body;
    let list = await List.findById(id);
    
    let review1 = await new Review({comment: `${comment}`,rating : rating});
    review1.author = req.user._id;
    list.review.push(review1);
    
    await review1.save();
    await list.save();
    // console.log(review1);
    req.flash("success","Reviews added");
    res.redirect(`/listing/${id}`);
}

module.exports.destroyReview = async (req,res)=>{
    let {id , reviewId} = req.params;
    await List.findByIdAndUpdate(id,{$pull : {review : reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Reviews deleted");
     res.redirect(`/listing/${id}`);
}