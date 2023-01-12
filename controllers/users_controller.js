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
    // code later
}

// Sign In and create the session for the user
module.exports.signIn=function(req,res){
    // code later
}
