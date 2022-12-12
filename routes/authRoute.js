const express = require("express");
const router = express.Router();
const passport = require('passport');
require("../middleWare/googleauthMiddleware");
require("../middleWare/facebookauthMiddleware");

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/'}),(req, res) => {
  res.redirect("/api/user/setpassword/:id");
});

router.get('/login/facebook',(req,res)=>{
  res.render("../views/pages/login.ejs"),{
    user:req.user
  }
}
);

router.get("/auth/facebook",passport.authenticate('facebook',{
  scope:['public_profile','email']
}));
router.get("/auth/facebook/callback",function(){
 passport.authenticate('facebook',{
  successRedirect:'/profile',
  failureRedirect:'/error'
 })
})
router.get('/logout',(req,res)=>{
  req.logOut();
  res.redirect("/")
})
  router.get('/facebook/profile',isloggedIn,(req,res)=>{ 
res.render("../views/pages/profile.ejs")
  }
  
  );
function isloggedIn(req,res,next){
  if(req.isAuthenticated())
  return next();
  res.redirect("/")
}



module.exports = router