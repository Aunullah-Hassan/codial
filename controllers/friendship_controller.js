const { populate } = require('../models/friendship');
const Friendship = require('../models/friendship');
const Post = require('../models/post');
const User = require('../models/user');

module.exports.addFriend = async function(req,res){
    try{

        let fromUser = await User.findById(req.user._id);
        let toUser = await User.findById(req.query.id);

        let isFriendship = await Friendship.findOne({ $or: [ { from_user: req.user._id,to_user: req.query.id}, { from_user: req.query.id,to_user: req.user._id }] });

        if(isFriendship){
            req.flash('error', 'Friendship exists, Both of you are alresdy friends');
            return res.redirect('back');
        }
        else{

            let friendship = await Friendship.create({
                from_user: req.user._id,
                to_user: req.query.id
            });
    
                fromUser.friendships.push(friendship._id);
                fromUser.save();
                toUser.friendships.push(friendship._id);
                toUser.save();
                
    
            let friend = await Friendship.findOne({from_user: req.user._id}).populate({path: 'to_user'});
            
    
            if(req.xhr){
               
                return res.json(200,{
                    data :{
                        friendship: friend
                    },
                    message: "Request is successful"
                });
    
            }else{
    
                req.flash('success', 'Friend Added');
                return res.redirect('back');
            }

        }

    }catch(err){
        console.log('error in catch block :', err);
        return res.redirect('back');
    }    

}

module.exports.removeFriend = async function(req,res){
    try{

        let friendship = await Friendship.findOne({ $or: [ { from_user: req.user._id,to_user: req.query.id}, { from_user: req.query.id,to_user: req.user._id }] });

        if(friendship){
            // console.log('friendship exists');
            let id = friendship.id;
            // console.log(id);
            await User.findByIdAndUpdate(req.query.id,{$pull: {friendships: friendship._id}});
            await User.findByIdAndUpdate(req.user._id,{$pull: {friendships: friendship._id}});
            friendship.remove();
            // friendship.save();
            
            if(req.xhr){
                // console.log('removing frien in xhr response');
                return res.json(200,{
                    mesaage: "Friendship Deleted",
                    data :{
                        id:id,
                        removedId:req.query.id
                    }
                })
        
            }else{
                req.flash('success', 'Friendship and associated relation Deleted!');
                return res.redirect('/');
            }
        
        }else{
            req.flash('error', 'Friendship does not exists, Both of you are not friends');
            return res.redirect('back');
        }


    }catch(err){
        console.log('error in deleting a friend ',err);
        // req.flash('error',err);
        return res.redirect('back');
    }
    
    

}