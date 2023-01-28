const Post=require('../models/post');
const Comment=require('../models/comment');
const User=require('../models/user');

module.exports.create= async function(req,res){

    // Post.create({
    //     content: req.body.content,
    //     user: req.user._id
    // },function(err,post){
    //     if(err){
    //         console.log('error in creating a post');
    //         return;
    //     }

    //     return res.redirect('back');

    // });

    try{

        let post=await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        

        if (req.xhr){
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user', 'name').execPopulate();

            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }
        


        req.flash('success', 'Post Published !!');
        return res.redirect('back');

    }catch(err){
        // console.log(err);
        // return;
        req.flash('error',err);
        return res.redirect('back');
    }

    
    
}

module.exports.destroy=async function(req,res){

    // Post.findById(req.params.id,function(err,post){

        // Check if one deleting the post is same as the One who have created the post(3rd level Authorization)
    //     if(post.user == req.user.id){
    //         // .id means converting the object id into string
            
    //         post.remove();

    //         Comment.deleteMany({post:req.params.id},function(err){
    //             return res.redirect('back');
    //         });
    //     }
    //     else{
    //         return res.redirect('back');
    //     }
    // });


    try{

        let post=await Post.findById(req.params.id);
        // Check if one deleting the post is same as the One who have created the post(3rd level Authorization)
        if(post.user == req.user.id){
            // .id means converting the object id into string
            
            post.remove();
    
            await Comment.deleteMany({post:req.params.id});

            if(req.xhr){
                // console.log('requesyt is xhr');
                return res.status(200).json({
                    data:{
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });

            }

            req.flash('success', 'Post and associated comments Deleted Succesfully!');

            return res.redirect('back');
        }
        else{
            req.flash('error', 'You cannot delete this post');
            return res.redirect('back');
        }

    }catch(err){
        // console.log(err);
        // return;
        req.flash('error',err);
        return res.redirect('back');
    }

}