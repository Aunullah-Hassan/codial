const passport=require('passport');
const JWTStrategy=require('passport-jwt').Strategy;
const ExtractJWT=require('passport-jwt').ExtractJwt;

const User=require('../models/user');

let opts={
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'codial'
}

// An example configuration which reads the JWT from the http Authorization header with the scheme 'bearer':
// sir told header is a list of keys & has a key called authorization which also has a list of keys so that can have a key called bearer And that bearer will be having the JWT Token

passport.use(new JWTStrategy(opts,function(jwtPayLoad,done){

    User.findById(jwtPayLoad._id,function(err,user){
        if(err){console.log('Error in finding user from JWT',err); return; }

        if(user){
            return done(null,user);
        }
        else{
            return done(null,false);
        }

    })

}))

module.exports=passport;