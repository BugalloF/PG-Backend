// Dependencies
const {Router} = require("express");
const router = Router();
// Files
const artRouter = require("./Artworks.js");
const transRouter = require("./Transactions.js");
const profileRouter = require("./Profile.js");
const filtersRouter = require("./Filters.js");
const categoryRouter = require("./Category.js");
const sendMail = require("./sendMail.js")
const login = require("./Login");
const register = require("./Register");
const forgotPassword = require("./forgotPassword");
const resetPassword = require("./resetPassword");
const followedfeed=require('./FollowedFeed');

// Configurar los routers
router.use("/art", artRouter);
router.use("/filter", filtersRouter);
router.use("/profile", profileRouter);
router.use("/categories", categoryRouter);
router.use("/login", login);
router.use("/register", register);
router.use('/forgot', forgotPassword)
router.use('/reset', resetPassword)
router.use("/emails",sendMail);
router.use('/followedfeed', followedfeed)
router.use('/transactions', transRouter)


module.exports = router;