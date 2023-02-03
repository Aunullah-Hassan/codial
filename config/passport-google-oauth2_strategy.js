const passport = require('passport');

const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const { use } = require('passport');

// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: "869707501348-edfcc075125iatt4ru3mffioum19j2uu.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback"

},

function(accessToken,refreshToken,profile,done){
    // find a user in our db
    User.findOne({email: profile.emails[0].value}).exec(function(err,user){
        if(err){console.log("error in google strategy-passport",err); return;}

        console.log(accessToken,refreshToken);
        console.log(profile);

        if(user){
            // if found set this user as req.user
           return done(null,user)
        }
        else{
            // if not find create a user and set it as req.user
            User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            },function(err,user){
                if(err){console.log('error in creating user google-strategy-passport',err); return}

                return done(null,user);

            })
        }

    });
}

));


module.exports=passport;
