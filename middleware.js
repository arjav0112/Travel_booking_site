const List = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema , reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedin = (req,res,next)=>{
   // console.log(req.session);
    if(!req.isAuthenticated()) {
        req.session.SaveUrl = req.originalUrl;
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    next();

};

module.exports.Savedurl = (req,res,next)=>{
    if(req.session.SaveUrl){
        res.locals.redirectUrl = req.session.SaveUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let id = req.params.id;
    let list = await List.findById(id);
    if(!list.owner._id.equals(res.locals.users["_id"])){
        req.flash("error","You dont have the Permission");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next) =>{
    
    let {error} = listingSchema.validate(req.body);
    // console.log(result);
    if(error){
      let errMsg = error.details.map((el)=> el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  
};

module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    // console.log(result);
    if(error){
      let errMsg = error.details.map((el)=> el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  
};

module.exports.isAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.users["_id"])){
        req.flash("error","You dont have the Permission");
        return res.redirect(`/listing/${id}`);
    }
    next();
}