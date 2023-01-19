
const Post=require('../models/post');
const User=require('../models/user');

module.exports.home = function(req,res){
   //  res.end('<h1>Hello welcome to first express contoller action</h1>');

   // console.log(req.cookies);
   // res.cookie('user_id',25)

   // Post.find({},function(err,posts){
   //    if(err){
   //       console.log('error in displaying posts');
   //       return;
   //    }
   //    return res.render('home',{
   //       title: "Codial | Home",
   //       posts:posts
   //    });
   // });

   // pre-Populating posts with corrresponding users
   Post.find({})
   .populate('user')
   .populate({
      path:'comments',
      populate:{
         path:'user'
      }
   })
   .exec(function(err,posts){

      User.find({},function(err,users){

         return res.render('home',{
            title: "Codial | Home",
            posts:posts,
            all_users:users
         });

      });
         

   })

   
}

