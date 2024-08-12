const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const {Savedurl} = require("../middleware.js");
const userController = require("../controller/users.js")

router.route("/signup")
.get(userController.renderSignup)
.post(userController.regiterUser)

router.route("/login")
.get(userController.renderLogin)
.post(Savedurl,passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }),userController.loginUser);

router.get("/logout",userController.logout);

module.exports = router;