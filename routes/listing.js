const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const listingController = require("../controllers/listing.js");
const { isLoggedIn, isOwner, validateListing, saveRedirectUrl } = require("../middleware.js");
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('image'), validateListing, wrapAsync(listingController.create));

router.get("/new", isLoggedIn, wrapAsync(listingController.new));

router.route("/:id")
    .get(wrapAsync(listingController.show))
    .patch(isLoggedIn, isOwner,upload.single('image'), validateListing, wrapAsync(listingController.update))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

module.exports = router;