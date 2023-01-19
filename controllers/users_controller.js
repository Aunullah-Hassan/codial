const User=require('../models/user');

module.exports.profile=function(req,res){
    // return res.end('<h1>Users Profile Controller');
    User.findById(req.params.id,function(err,user){

        return res.render('user_profile',{
            title:'Users Home',
            profile_user:user
        });
// in above statement we need to be careful while deciding key as user already exists in local so i use profile_user
    });

    
}

module.exports.update=function(req,res){
    if(req.user.id == req.params.id){
        // User.findByIdAndUpdate(req.params.id,{name:req.body.name,email:req.body.email});
        User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
            return res.redirect('back');
        });

    }else{
        // someone fiddled with our form means logged in user can update the profile of other user by inspect
        return res.status(401).send('Unauthorized');
    }
}

// Render the sign Up Page
module.exports.signUp=function(req,res){
    // if user is already signed in then he/she will not be able to acces sign up page
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up',{
        title: "Codial | Sign Up"
    });
}

// Render the Sign In Page
module.exports.signIn=function(req,res){

    // if user is already signed in then he/she will not be able to acces sign in page
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title: "Codial | Sign In"
    });
}

// Get the Sign up data
module.exports.create=function(req,res){
    console.log(req.body);
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email:req.body.email},function(error,user){
        if(error){
            console.log('error in finding user in signing Up');
            return;
        }
        if(!user){
            User.create(req.body,function(error,user){
                if(error){
                    console.log('error in creating user while signing Up');
                    return;
                } 

                return res.redirect('/users/sign-in');
            });
        }
        else{
            return res.redirect('back');
        }

    });

}

// Sign In and create the session for the user
module.exports.createSession=function(req,res){
    return res.redirect('/');
}

// For sign out passport JS gives logout function to request

module.exports.destroySession=function(req,res,next){
    // req.logout();
    // return res.redirect('/');

    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
}