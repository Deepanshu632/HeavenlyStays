const Listing = require("../models/listing.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken =process.env.MAP_TOKEN;
const geocodingClient= mbxGeocoding({ accessToken: maptoken});

module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}


module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
}



module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    let listingsData = await Listing.findById(id)
    .populate({path:"riviews",          //hum har reviews path ke sath ke sath uska author path bhi populate krna chahte hain
        populate:{
            path:"author"},
        }).populate("owner");     
     if(!listingsData){
        req.flash("error","The listing you are trying to reach doesn't exist");
        res.redirect("/listings");
     }
    //  console.log(listingsData);
     res.render("listings/show.ejs",{listingsData});
    }


module.exports.createListing = async(req,res,next) => {
    let response = await geocodingClient
    .forwardGeocode({
        query : req.body.listing.location,
        limit :1,
    })
    .send();
    const url = req.file.path;
    const filename = req.file.filename; 
    const Listings = new Listing(req.body.listing);     
        Listings.owner = req.user._id;
        Listings.image= { filename , url };
        Listings.geometry= response.body.features[0].geometry;
       let saved= await Listings.save(); 
       console.log(saved)  ;
        req.flash("Success", "New Listing Created");
        res.redirect("/listings");
    }

module.exports.editListing = async(req,res)=>{
        let {id} = req.params;  
        let listings = await Listing.findById(id);
        if(!listings){
            req.flash("error","The listing you are trying to reach doesn't exist");
            res.redirect("/listings");
         }
         let originalImageUrl = listings.image.url;
         originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listings , originalImageUrl});
    }

module.exports.updateListing = async(req,res) => {
        let{id}= req.params;
        let updatedListing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

        if(typeof req.file !== "undefined"){
            const url = req.file.path;
             const filename = req.file.filename; 
             updatedListing.image =  { filename , url };
             await updatedListing.save();
        }
        req.flash("Success","Listing Updated");
        res.redirect(`/listings/${id}`);
        }
       
       
        
    module.exports.destroyListing=async(req,res)=>{
            let{id}=req.params;
            let deletedChat= await Listing.findByIdAndDelete(id);
            req.flash("Success","Listing Deleted");
            res.redirect("/listings");
        }
