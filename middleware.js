const Listing = require("./models/listing.js")
const {listingSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const {riviewSchema} = require("./schema.js");
const Riview =require("./models/riview.js");


module.exports.isLoggedIn = ((req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in for changes in listing");
       return res.redirect("/login");
    }
    next();
});


module.exports.saveRedirectUrl= (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

//to check jo bhi current user hai wo hamari listing ka owner hai ya nhi
module.exports.isOwner= async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.curr._id)){
       req.flash("error","You are not the owner of this listing");
       return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(402,errMsg);
    }else{
        next();
    }
 };

 module.exports.validateRiview = (req,res,next) =>{
    let {error} = riviewSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(402,errMsg);
    }else{
        next(error);
    }
 }

 module.exports.isRiviewAuthor= async(req,res,next)=>{
    let {id,riviewId} = req.params;
    let riview = await Riview.findById(riviewId);
    if(!riview.author.equals(res.locals.curr._id)){
       req.flash("error","You are not the Author of this Riview");
       return res.redirect(`/listings/${id}`);
    }
    next();
}

