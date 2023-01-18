const { create } = require('connect-mongo');
const express=require('express');
const Comment=require('../models/comment');
const Post=require('../models/post');

module.exports.create=function(req,res){

    Post.findById(req.body.post,function(err,post){
        if(err){console.log('error in finding corrsponding post of comment in Db'); return}
        
        if(post){
            Comment.create({
                content:req.body.content,
                user:req.user._id,
                post:req.body.post
            },function(err,comment){
                if(err){console.log('error in creating comment in Db'); return}
                    // First time updating the post collection of DB
                post.comments.push(comment);
                post.save();

                return res.redirect('/');
            });
        }

    });
}

module.exports.destroy=function(req,res){

    Comment.findById(req.params.id,function(err,comment){
        // console.log('comment fetched')
        if(!(comment.user == req.user.id)){
            // console.log('post and user in if block')
            // let post_id=comment.post.id;
            // console.log(comment.post.toString());
            Post.findById(comment.post.toString(),function(err,post){
                if(err){console.log(err);
                    return;
                }
                // console.log('post fetched')
                if(post.user.toString() == req.user.id){
                    console.log('post and user matched')
                    comment.remove();

                    Post.findByIdAndUpdate(post.id,{ $pull: {comments: req.params.id} },function(err,post){
                        return res.redirect('back');
                    });
                }
               
            })
        }

       else if(comment.user == req.user.id){
        // Before deleting comment i need to store the postid to delete this comment from comments[] of post
            let postId=comment.post;

            
            comment.remove();

            Post.findByIdAndUpdate(postId,{ $pull: {comments: req.params.id} },function(err,post){
                return res.redirect('back');
            });

        }
        else{
            return res.redirect('back');
        }

    });

}