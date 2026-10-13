const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport= require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const usersController = require("../controllers/users.js");

//home route
router.get("/", (req, res) => {
    res.redirect("/listings");
});

//signupForm & signup
router
.route("/signup")
.get(usersController.renderSignUpForm)
.post(wrapAsync(usersController.signUp))


//login form and login
router.route("/login")
.get(usersController.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
    usersController.login
)

//logout
router.get("/logout",usersController.logout);

module.exports = router;
