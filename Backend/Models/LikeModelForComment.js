const mongoose = require('mongoose');

const likeSchemaForComment = new mongoose.Schema({
 
    commentId :{type:String , required :true},
    likedBy : {type:String, required : true},
    profilePicture :{type:String}

},{versionKey:false});

const LikeModelForComment = mongoose.model('LikeForComment',likeSchemaForComment)

module.exports = LikeModelForComment;