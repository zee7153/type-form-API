const express = require("express");
const router = express.Router();
const passport = require('passport');
require("../middleWare/googleauthMiddleware");
require("../middleWare/facebookauthMiddleware");


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/'}),(req, res) => {
  res.redirect("/api/user/setpassword/:id");
});

router.get('/login/facebook',
   passport.authenticate('facebook', { scope: ['profile','email'] }));

  router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });




module.exports = router