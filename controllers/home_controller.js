
const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req,res){
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
               // Post.find({})
               // .populate('user')
               // .populate({
               //    path:'comments',
               //    populate:{
               //       path:'user'
               //    }
               // })
               // .exec(function(err,posts){

               //    User.find({},function(err,users){

               //       return res.render('home',{
               //          title: "Codial | Home",
               //          posts:posts,
               //          all_users:users
               //       });

               //    });
                     

               // })

               // ABOVE CODE IS CALLBACK HELL WITHOUT ASYNC AWAIT

   try{

      let posts = await Post.find({})
      .sort('-createdAt')
      .populate('user')
      .populate({
         path:'comments',
         populate:{
            path:'user'
         },
         populate: {
            path: 'likes'
        }
      })
      .populate('comments')
      .populate('likes');
   
      let users = await User.find({});
      // console.log(users);

      if(req.user){
            let logged_user = await User.findById(req.user._id)
            .populate({
               path: 'friendships',
               populate: {
                  path: 'from_user'
               }
            })
            .populate({
               path: 'friendships',
               populate: {
                  path: 'to_user'
               }
            });
            // console.log(logged_user);
            return res.render('home',{
               title: "Codial | Home",
               posts:posts,
               all_users:users,
               logged_user:logged_user
            });
      }
      else{

         return res.render('home',{
            title: "Codial | Home",
            posts:posts,
            all_users:users
         });

      }

   }catch(err){
      console.log('Error :',err);
      return;
   }
  
}

