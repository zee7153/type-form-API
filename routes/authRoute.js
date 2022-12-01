const express = require("express");
const router = express.Router();
const passport = require('passport');
require("../middleWare/googleauthMiddleware");
require("../middleWare/facebookauthMiddleware");


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',passport.authenticate('google'),(req,res)=>{
   res.send(req.user)

});



router.get('/facebook',
   passport.authenticate('facebook', { scope: ['profile','email'] }));

  router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });




module.exports = router