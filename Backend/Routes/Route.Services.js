const express = require('express');
const PostModel = require('../Models/PostModel');

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



module.exports = ServiceRouter;