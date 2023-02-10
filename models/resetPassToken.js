const mongoose = require('mongoose');
const { schema } = require('./user');

const resetPassTokenSchema = new mongoose.Schema({
    
    user :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    accesToken :{
        type : String,
        required : true
    },
    isValid :{
        type : Boolean,
        required : true
    }

},{
    timestamps : true
});

const PassToken = mongoose.model('PassToken', resetPassTokenSchema);
module.exports = PassToken;