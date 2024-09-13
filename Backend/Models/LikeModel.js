
const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({

    postId :{type:String,required:true},
    likedBy :{type:String,required:true}

},{versionKey:false});

const LikeModel = mongoose.model('Like',likeSchema);

module.exports = LikeModel;