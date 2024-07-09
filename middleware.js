const Listing = require("./models/listing");
const Review = require("./models/review")
const expressError = require("./utils/expressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("failure","Login required");
        res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    res.locals.redirectUrl = req.session.redirectUrl;
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} =req.params;
    let listing = await Listing.findById(id);
    if(req.user && !listing.owner.equals(req.user._id)){
        req.flash("failure","You are not authorized to edit this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewOwner = async(req,res,next)=>{
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(req.user && !review.author.equals(req.user._id)){
        req.flash("failure","You are not authorized to delete this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing =(req,res,next)=>{
    let {error} =listingSchema.validate(req.body);
    
    if (error) {
        let errMsg = error.details.map(el=>el.message).join(",");
        console.log(error);
        throw new expressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.validateReview =(req,res,next)=>{
    let {error} =reviewSchema.validate(req.body);
    
    if (error) {
        let errMsg = error.details.map(el=>el.message).join(",");
        console.log(error);
        throw new expressError(400,errMsg);
    }else{
        next();
    }
}