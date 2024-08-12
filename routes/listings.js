const express = require("express");
const router = express.Router();
const List = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedin , isOwner } = require("../middleware.js");
const {validateListing} = require("../middleware.js");
const listingcontroller = require("../controller/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })

//home page, Create new listing
router.route("/")
.get(wrapAsync(listingcontroller.homePage))
.post(upload.single('image'),validateListing,isLoggedin,wrapAsync(listingcontroller.createNew))


//rendering new form page.
router.get("/new",isLoggedin,listingcontroller.renderNewpage);
  
//rendering show page,Upating the travel listing,Delting a travel listing.
router.route("/:id")
.get(wrapAsync(listingcontroller.renderShowpage))
.patch(isLoggedin,isOwner,upload.single('image'),validateListing,wrapAsync(listingcontroller.updateListing))
.delete(isLoggedin,isOwner,wrapAsync(listingcontroller.destroyListing))

//rendering edit page.
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingcontroller.renderEditpage));

module.exports= router;