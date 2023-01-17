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

