const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares/middleware.js");
const { signup, renderSignupForm, renderLoginForm, login, logout } = require("../controllers/users.js");


router.route("/signup")
    .get(renderSignupForm)
    .post(saveRedirectUrl, wrapAsync(signup));

router.route("/login")
    .get(renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), (login));

router.get("/logout", logout);

module.exports = router;