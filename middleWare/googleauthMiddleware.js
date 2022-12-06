const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((_id, done) => {
    User.findById(_id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: "991783069390-a3nj7et42l94amtr6fpqr9ql4tds14ho.apps.googleusercontent.com",
        clientSecret:"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",
        callbackURL: '/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists in our own db
        console.log(profile);
        User.findOne({email: profile.emails[0].value}).then((currentUser) => {
            if(currentUser){
                // already have this user
                console.log('user is: ', currentUser);
                done(null, currentUser);
            } else {
                // if not, create user in our db
                new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    provider: 'google'
                }).save().then((newUser) => {
                    
                    console.log('created new user: ', newUser);
                    done(null, newUser);
                });
            }
        });
    })
);