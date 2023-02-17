const User = require('../models/user');
const PassToken = require('../models/resetPassToken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const PassResetMailer = require('../mailers/password_reset_mailer');
const Friendship = require('../models/friendship');

const fs = require('fs');
const path = require('path');
// let's keep it same as before
module.exports.profile = async function(req,res){
    // return res.end('<h1>Users Profile Controller');
   try{
    let friendship;
    friendship = await Friendship.findOne({to_user: req.params.id,from_user: req.user._id});
    if(friendship){

            let user = await User.findById(req.params.id);
            return res.render('user_profile',{
                title : 'Users Profile',
                profile_user: user,
                isFriend:true
            });

    }

    friendship = await Friendship.findOne({to_user: req.user._id,from_user: req.params.id});
    if(friendship){

        let user = await User.findById(req.params.id);
            return res.render('user_profile',{
                title : 'Users Profile',
                profile_user: user,
                isFriend:true
            })

    }

        let user = await User.findById(req.params.id);
        return res.render('user_profile',{
            title : 'Users Profile',
            profile_user: user,
            isFriend:false
        });
     
   }catch(err){
        req.flash('error',"Error in rending profile page (:");
        return res.redirect('back');
   }
    

//     User.findById(req.params.id,function(err,user){

//         return res.render('user_profile',{
//             title:'Users Home',
//             profile_user:user
//         });
// // in above statement we need to be careful while deciding key as user already exists in local so i use profile_user
//     });

    
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
                    if(err){console.log('******Multer Error :',err);}

                    console.log(req.file);
                    user.name=req.body.name;
                    user.email=req.body.email;

                    if(req.file){

                        if(user.avatar){

                            fs.unlinkSync(path.join(__dirname,'..',user.avatar));

  

                        }
                        

                        // this is saving the path of uploaded file into the avatar field in the user
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

module.exports.recoverPassword = function(req,res){
    
    return res.render('recover_password_form_Screen', {
        title: "password-Reset"
    });

}

module.exports.recoverPasswordMail = async function(req, res){

    let user = User.findOne({email : req.body.email},async function(err,user){
        if(err){console.log("error in finding user :", err); return;}

        if(user){

           let pass_token = await PassToken.create({
                user : user._id,
                accesToken : crypto.randomBytes(20).toString('hex'),
                isValid : true
            });
            console.log(pass_token);
            PassToken.findOne({_id : pass_token._id}).populate('user').exec(function(err,passToken){
                if(err){console.log('error in populating passtoken', err); return;}
                PassResetMailer.PassReset(passToken);
                req.flash('success','Password Recovery link hass been sent to Your Registered email !');
                
                return res.redirect('/');
                
            });  

        }
        else{
            req.flash('success','Invalid email, email addresss not registered !');
           
            return res.redirect('back');
        }

    });


}

module.exports.renderChangePasswordScreen = function(req,res){
    // console.log(req.query.accessToken);
    return res.render('set_new_password_screen',{
        title : "Change Password",
        accesToken : req.query.accessToken
    });

}

module.exports.checkPasswordToken = function(req, res){
    // console.log(req.query.accessToken);
        PassToken.findOne({accesToken : req.query.accessToken}, function(err,pass_token){
        if(err){console.log('Error in finding password token'); return;}
            // console.log(pass_token);
        if(pass_token.isValid){
             User.findById(pass_token.user, function (err, user) {
                if(err){console.log('error in finding user in db!',err ); return;}

                if(req.body.password === req.body.confirm_password){
                    user.password = req.body.password;
                    user.save();
                    pass_token.isValid = false;
                    pass_token.save();
                       
                    req.flash('success','Password changed succesfully so please login !');
                    return res.redirect('/users/sign-in');
                    
                }else{
                    req.flash('error','Password and confirm password did not match !');
                   
                    return res.redirect('back');
                }

            });
            
        }
        else{
            req.flash('error','Link has expired re-generate the link,click on Forgot Password !');
    
            return res.redirect('/users/sign-in');
        }
    });
}