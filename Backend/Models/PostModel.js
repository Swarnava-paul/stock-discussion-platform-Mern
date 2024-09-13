const mongoose = require('mongoose');

const postSchema  = new mongoose.Schema({
userId:{type:String,required:true},
stockSymbol:{type:String,required:true},
title:{type:String,required:true},
description:{type:String,required:true},
likesCount:{type:Number , default : 0},
commentsCount:{type:Number , default :0},
postDate:{type:Date,default : ()=>new Date()}
},{versionKey:false})

const PostModel = mongoose.model('Post',postSchema);

module.exports = PostModel;