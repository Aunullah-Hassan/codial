module.exports.profile=function(req,res){
    // return res.end('<h1>Users Profile Controller');

    return res.render('user_profile',{
        title:'Users Home'
    });
}
