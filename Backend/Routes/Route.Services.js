const express = require('express');
const PostModel = require('../Models/PostModel');

const ServiceRouter = express.Router();
ServiceRouter.use(express.json());

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
     const {stockSymbol,sortBy,page=1} = req.query;
     
     const pageLimit = 10;
     const skipContent = page * pageLimit - pageLimit; // logic of skipping content for pagination

     if(stockSymbol && sortBy) {

        let dynamicSortingKey = {}
        const sortType = sortBy.split("=")[0];
        const sortOrder = sortBy.split("=")[1];
  
        if(sortType == 'date' && sortOrder == 'asc') {
            dynamicSortingKey.postDate = 1
        }else {
            dynamicSortingKey.postDate = -1
        }

        const posts = await PostModel.find({stockSymbol:{$eq:stockSymbol}}).skip(skipContent)
        .limit(pageLimit).sort(dynamicSortingKey)

        if(!posts) {
            return res.status(200).json({message:"No Posts Found"})
        }

        return res.status(200).json({posts});
     } // if filter and sort parameters are present in query string

     const posts = await PostModel.find({}).skip(skipContent).limit(pageLimit); // incase of normal post fetching with out any sort
     
     if(!posts) {
        return res.status(200).json({message:"No Posts Found"})
     } // incase of normal post fetching with out any sort 

     return res.status(200).json({posts});

    }catch(error) {
    res.status(500).json({message:"Internal Server Error"});
    }
}) // handles the logic of retrive posts from db 

module.exports = ServiceRouter;