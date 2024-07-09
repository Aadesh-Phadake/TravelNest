const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const flash = require("connect-flash");
const userController = require("../controllers/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

router.use(flash());

router.route("/signup")
    .get(wrapAsync(userController.getSignup))
    .post(wrapAsync(userController.postSignup));

router.route("/login")
    .get(wrapAsync(userController.getLogin))
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",
    failureFlash:true}),wrapAsync(userController.postLogin));

router.get("/logout",wrapAsync(userController.getLogout))
module.exports = router;