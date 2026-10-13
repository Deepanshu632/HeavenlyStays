const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing =require("../models/listing.js");
const Riview =require("../models/riview.js");
const {validateRiview, isLoggedIn , isRiviewAuthor} = require("../middleware.js")
const riviewController = require("../controllers/riviews.js");

   
router.post("/",isLoggedIn,validateRiview,wrapAsync(riviewController.postRiview));
router.delete("/:riviewId",isLoggedIn, isRiviewAuthor, wrapAsync(riviewController.destroyRiview));
    
 module.exports = router;