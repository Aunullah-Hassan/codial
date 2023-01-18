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
        

        if(comment.user == req.user.id){
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