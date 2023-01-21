const Post=require('../models/post');
const Comment=require('../models/comment');

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

        await Post.create({
            content: req.body.content,
            user: req.user._id
        });

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