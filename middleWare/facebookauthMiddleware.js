const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/userModel');

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((obj,cb) => {
   
        cb(null, obj);
    
});
passport.use(new FacebookStrategy({
    clientID: '512474604251024',
    clientSecret: 'f18ae927e95112abf9bad99768dae0d7',
    callbackURL: "http://localhost:3000/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email'],
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
       
      return done(null,profile);
    });
  }
));