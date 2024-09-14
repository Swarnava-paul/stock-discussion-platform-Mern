
const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({

    postId :{type:String,required:true},
    likedBy :{type:String,required:true},
    profilePicture:{type:String}

},{versionKey:false});

const LikeModel = mongoose.model('Like',likeSchema);

module.exports = LikeModel;