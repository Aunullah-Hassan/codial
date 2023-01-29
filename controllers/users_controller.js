const User=require('../models/user');

// let's keep it same as before
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

module.exports.update = async function(req,res){

    // if(req.user.id == req.params.id){
    //     // User.findByIdAndUpdate(req.params.id,{name:req.body.name,email:req.body.email});

    //     User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
    //         if(err){
    //             req.flash(err);
    //             return res.redirect('back');
    //         }
    //         req.flash('success','Profile Updated!');
    //         return res.redirect('back');
    //     });

    // }else{
    //     // someone fiddled with our form means logged in user can update the profile of other user by inspect
    //     req.flash('error','Unauthorized');
    //     return res.status(401).send('Unauthorized');
    // }

    if(req.user.id == req.params.id){
        
            try{

                let user= await User.findById(req.params.id);
                User.uploadedAvatar(req,res,function(err){
                    if(err){console.log('******Multer Errror :',err);}

                    console.log(req.file);
                    user.name=req.body.name;
                    user.email=req.body.email;

                    if(req.file){
                        user.avatar = User.avatarPath + '/' +req.file.filename;
                    }
                    user.save();
                    return res.redirect('back');
                    
                });


            }catch(err){
                req.flash('error',err);
                return res.redirect('back');
            }


    }else{
        // someone fiddled with our form means logged in user can update the profile of other user by inspect
        req.flash('error','Unauthorized');
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
    // console.log(req.body);
    if(req.body.password != req.body.confirm_password){
        req.flash('error',"password does not matched");
        return res.redirect('back');
    }

    User.findOne({email:req.body.email},function(error,user){
        if(error){
            // console.log('error in finding user in signing Up');
            req.flash('error',error)
            return;
        }
        if(!user){
            User.create(req.body,function(error,user){
                if(error){
                    // console.log('error in creating user while signing Up');
                    req.flash('error',error);
                    return;
                } 

                req.flash('success','Succesfully signed up please Log in!')
                return res.redirect('/users/sign-in');
            });
        }
        else{
            req.flash('error','This user already exists');
            return res.redirect('back');
        }

    });

}

// Sign In and create the session for the user
module.exports.createSession=function(req,res){
    req.flash('success','Logged in Succesfully');
    return res.redirect('/');
}

// For sign out passport JS gives logout function to request

module.exports.destroySession=function(req,res,next){
    // req.logout();
    // return res.redirect('/');

    req.logout(function(err) {
        if (err) { return next(err); }

        req.flash('success','You have Logged out');
        // res.redirect('/',{flash: {success: ""}});
// becoz i need to send this flash message on the response----------
        res.redirect('/');
      });
}