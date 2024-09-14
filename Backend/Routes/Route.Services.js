const express = require('express');

// models
const PostModel = require('../Models/PostModel');
const UserModel = require('../Models/UserModel');
const LikeModel = require('../Models/LikeModel');
const CommentModel = require('../Models/CommentModel');

const ServiceRouter = express.Router();
ServiceRouter.use(express.json());

// modules
const sortFunction = require('../Modules/SortFunction');

ServiceRouter.post('/',async(req,res)=>{
    try {
     const {user} = req;
     const { stockSymbol,title,description , likesCount , commentsCount} = req.body;

     if(!stockSymbol || !title || !description ) {
        return res.status(400).json({message:"No Body Provided"})
     }

     const createPost = await PostModel.create({userId:user._id,title,stockSymbol,description,likesCount,commentsCount});

     if(!createPost) {
        return res.status(400).json({message:"Posting Failed"})
     }

     return res.status(200).json({ success: true, postId : createPost._id , message: 'Post created successfully' });

    }catch(error) {
     res.status(500).json({message:"Internal Server Error"});

    }
}) // handles the logic of create a post

ServiceRouter.get('/',async(req,res)=>{
    try{
     const {stockSymbol,sortBy,page=1,likes} = req.query;
     
     const pageLimit = 10;
     const skipContent = page * pageLimit - pageLimit; // logic of skipping content for pagination

     if(stockSymbol && sortBy) {
        const dynamicSortingKey = sortFunction(sortBy); // call this function for determine sortType and sortOrder return an object use in sort
        
        const posts = await PostModel.find({stockSymbol:{$eq:stockSymbol}}).skip(skipContent)
        .limit(pageLimit).sort(dynamicSortingKey)

        if(!posts) {
            return res.status(200).json({message:"No Posts Found"})
        }

        return res.status(200).json({posts});
     } // if filter and sort parameters are present in query string
      
    if(!stockSymbol && sortBy) {
        let dynamicSortingKey = sortFunction(sortBy);

        const posts = await PostModel.find({}).skip(skipContent)
        .limit(pageLimit).sort(dynamicSortingKey)

        if(!posts) {
            return res.status(200).json({message:"No Posts Found"});
        }

        return res.status(200).json({posts});
    } // if only sort Parameter is there

     const posts = await PostModel.find({}).skip(skipContent).limit(pageLimit); // incase of normal post fetching with out any sort
     
     if(!posts) {
        return res.status(200).json({message:"No Posts Found"})
     } // incase of normal post fetching with out any sort 

     return res.status(200).json({posts});

    }catch(error) {
    res.status(500).json({message:"Internal Server Error"});
    }
}) // handles the logic of retrive posts from db 

ServiceRouter.delete('/:postId',async(req,res)=>{
    try{
     const {postId} = req.params;
     const post = await PostModel.deleteOne({_id:{$eq:postId}});

     if(post.deletedCount == 0) {
     return res.status(200).json({message:"Post is Not Deleted"})
     } // if deletedCount is 0 then means post is not deleted 

     return res.status(200).json({ success: true, message: 'Post deleted successfully' })

    }catch(error) {
     res.status(500).json({message:"Internal Server Error"});
    }
}) // handles the logic of delete post from db by using post id

ServiceRouter.post('/:postId/like',async(req,res)=>{
    try{
        const {postId} = req.params;
        const {user:{_id}} = req; // _id from authorization token from authChecking middleware
        const {userId,profilePicture} = await UserModel.findOne({_id}); // use _id to retrive userId & profilepictore

        const likedPost = await LikeModel.findOne({postId,likedBy:userId}); // find like document 
    
       if(!likedPost) {
        const like = await LikeModel.create({postId,likedBy:userId,profilePicture});
        const increaseLikeInPost = await PostModel.updateOne({_id:postId},{$inc:{likesCount:1}});
        if(like && increaseLikeInPost.modifiedCount == 1) {
         res.status(200).json({ success: true, message: 'Post liked' });
        }
       } // if like is not present to that post id means have to create like and also increase like count
        else {
         const deleteLike = await LikeModel.deleteOne({postId,likedBy:userId});
         const decreaseLikeInPost = await PostModel.updateOne({_id:postId},{$inc:{likesCount:-1}});
         if(deleteLike.deletedCount == 1 && decreaseLikeInPost.modifiedCount == 1) {
            res.status(200).json({ success: true, message: 'Post unliked' });
         }
       } // else is like document found means have to delete  like unlike and decrease like from that post

    }catch(error) {
        res.status(500).json({message:"Internal Server Error"});
    }
}) // handles the logic of like and unlike a post

ServiceRouter.post('/:postId/comments',async(req,res)=>{
    
    try{
     const {comment} = req.body;
     const {postId} = req.params;
     const {user:{_id,userId}} = req; // from middleware
     const {profilePicture} = await UserModel.findOne({_id:_id}); //  retrive profile picture for storing comment
     // and userId with profile picture to display comment with user id with profile picture in front-end

     const findPost = await PostModel.findOne({_id:postId});
     
     if(!findPost) {
        return res.status(400).json({message:"No post Found"});
     } // check first if post exist or not 

     const commentObject = {
        postId,
        commentBy:userId,
        profilePicture,
        comment,
     } // comment to be posted and stored in db

     const createComment = await CommentModel.create(commentObject); // store comment in db
     const increaseCommentsCount = await PostModel.updateOne({_id:postId},{$inc:{commentsCount:1}});
     // increase comments count in that post document

     if(!createComment && increaseCommentsCount.modifiedCount == 0) {
        return res.status(400).json({message:"Comment is not posted try Again "});
     }
     
     const {_id:commentId} = createComment;
     return res.status(200).json({ success: true, commentId, message: 'Comment added successfully' });

    }catch(error) {
        res.status(500).json({message:"Internal Server Error"})
    }
}) // handles the logic of add comment to a post 



module.exports = ServiceRouter;