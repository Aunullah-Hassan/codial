// const { create } = require('connect-mongo');
const express=require('express');
const Comment=require('../models/comment');
const Post=require('../models/post');

module.exports.create=async function(req,res){

    try{
        let post=await Post.findById(req.body.post);

        if(post){
            let comment=await Comment.create({
                content:req.body.content,
                user:req.user._id,
                post:req.body.post
            });

            post.comments.push(comment);
            post.save();

            return res.redirect('/');

        }

    }catch(err){
        console.log('Error :',err);
        return;
    }

    


    // Post.findById(req.body.post,function(err,post){
    //     if(err){console.log('error in finding corrsponding post of comment in Db'); return}
        
    //     if(post){
    //         Comment.create({
    //             content:req.body.content,
    //             user:req.user._id,
    //             post:req.body.post
    //         },function(err,comment){
    //             if(err){console.log('error in creating comment in Db'); return}
    //                 // First time updating the post collection of DB
    //             post.comments.push(comment);
    //             post.save();

    //             return res.redirect('/');
    //         });
    //     }

    // });

}

module.exports.destroy=async function(req,res){

    try{

        let comment = await Comment.findById(req.params.id);

        if(!(comment.user == req.user.id)){
    
            let post = await Post.findById(comment.post.toString());
    
            if(post.user.toString() == req.user.id){
                console.log('post and user matched')
                comment.remove();
                await Post.findByIdAndUpdate(post.id,{ $pull: {comments: req.params.id} });
    
                return res.redirect('back');
            }
    
        }else if(comment.user == req.user.id){
            // Before deleting comment i need to store the postid to delete this comment from comments[] of post
                let postId=comment.post;
    
                
                comment.remove();
    
                await Post.findByIdAndUpdate(postId,{ $pull: {comments: req.params.id} });
                return res.redirect('back');
    
        }else{
                return res.redirect('back');
            }

    }catch(err){
        console.log('Error :',err);
        return;
    }

}