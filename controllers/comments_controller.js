// const { create } = require('connect-mongo');
const express = require('express');
const Comment = require('../models/comment');
const Post = require('../models/post');
const commentMailer = require('../mailers/comments_mailer');

const queue = require('../config/kue');
const commentsEmailWorker = require('../workers/comment_email_worker');

module.exports.create = async function(req,res){

    try{
        let post=await Post.findById(req.body.post);

        if(post){
            let comment=await Comment.create({
                content:req.body.content,
                user:req.user._id,
                post:req.body.post
            });

        // below statement will automatically pick comment_id and put it in comments array of post
            post.comments.push(comment);  
            post.save();
           
            comment = await comment.populate('user', 'name email');
            // .execPopulate()
            // commentMailer.newComment(comment);

            let job = queue.create('emails', comment).save(function(err){

                if(err){
                    console.log('Error in sending to the queue', err);
                    return;
                }
                console.log('Job enqueued', job.id);

            });
            
            if (req.xhr){
                // Similar for comments to fetch the user's id!
                
                
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment Added!"
                });
            }

            req.flash('success','comment added!');

            return res.redirect('/');

        }

    }catch(err){
        // console.log('Error :',err);
        req.flash('error',err);
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
                // console.log('post and user matched');
                comment.remove();
                await Post.findByIdAndUpdate(post.id,{ $pull: {comments: req.params.id} });

            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted"
                });
            }
                
                req.flash('success','comment deleted succesfully !');
                return res.redirect('back');
            }
    
        }else if(comment.user == req.user.id){
            // Before deleting comment i need to store the postid to delete this comment from comments[] of post
                let postId=comment.post;
    
                
                comment.remove();
    
                await Post.findByIdAndUpdate(postId,{ $pull: {comments: req.params.id} });

            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted"
                });
            }

                req.flash('success','comment deleted succesfully !');
                return res.redirect('back');
    
        }else{
                req.flash('error','Unauthorized !');
                return res.redirect('back');
            }

    }catch(err){
        // console.log('Error :',err);
        req.flash('error',err);
        return;
    }

}