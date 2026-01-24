const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js")

router.route("/signup")
.get( userController.renderSignupForm)
.post( wrapAsync(userController.signup));


router.route("/login")
.get(userController.renderLoginForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
 userController.login
);

//SIGNUP ROUTE TO RENDER A FORM TO CREATE A NEW USER //
// router.get("/signup", userController.renderSignupForm);

//CREATE ROUTE TO ADD A NEW USER TO DB //
// router.post("/signup", wrapAsync(userController.signup));

//LOGIN ROUTE TO RENDER A FORM TO LOGIN //
// router.get("/login",userController.renderLoginForm);

//LOGIN ROUTE TO LOGIN USER //
// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//  userController.login
// );

//LOGOUT ROUTE TO LOGOUT USER //
router.get("/logout",userController.logout);

module.exports = router;
