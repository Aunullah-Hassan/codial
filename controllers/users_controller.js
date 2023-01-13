const User=require('../models/user');

module.exports.profile=function(req,res){
    // return res.end('<h1>Users Profile Controller');

    return res.render('user_profile',{
        title:'Users Home'
    });
}

// Render the sign Up Page
module.exports.signUp=function(req,res){
    return res.render('user_sign_up',{
        title: "Codial | Sign Up"
    });
}

// Render the Sign In Page
module.exports.signIn=function(req,res){
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
