const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({

    postId :{type:String , required : true},
    commentBy : {type:String,required:true},
    profilePicture:{type:String},
    comment : {type:String , required : true},
    likes : {type: Number , default : 0}

},{versionKey:false});

const CommentModel = mongoose.model('Comment',commentSchema);

module.exports = CommentModel;