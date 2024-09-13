const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({

    postId :{type:String , required : true},
    commentBy : {type:String,required:true},
    comment : {type:String , required : true},
    likes : {type: Number}

});

const CommentModel = mongoose.model('Comment',commentSchema);

module.exports = CommentModel;