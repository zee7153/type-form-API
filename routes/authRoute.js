const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const passport = require('passport');
require("../middleWare/googleauthMiddleware");
require("../middleWare/facebookauthMiddleware");
const asyncHandler = require("express-async-handler");


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.send(req.user)
});

router.get('/setpassword', asyncHandler(async (req, res) => {
  const {  password } = req.body;
   const user = await User.create(password);


}));


router.get('/login/facebook',
   passport.authenticate('facebook', { scope: ['profile','email'] }));

  router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });




module.exports = router