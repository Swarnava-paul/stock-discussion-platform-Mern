const express = require('express');

const UserProfileRouter = express.Router();
const UserModel = require('../Models/UserModel');

UserProfileRouter.use(express.json());

UserProfileRouter.get('/profile/:userId',async(req,res)=>{
const userid =  req.params.userId;
const user = await UserModel.findOne({userId:userid});

if(!user) {
  return res.status(200).json({message:"No User Found"})
}
const {_id,userId,name, profilePicture} = user;
return res.status(200).json({ _id, userName : userId, name , profilePicture  })

}) // handles to get basic user profile info 

UserProfileRouter.patch('/profile',async(req,res)=>{

    try {
     const {user} = req;

     const payload = req.body;

     const User = await UserModel.updateOne({_id:user._id},{$set:{...payload}});
     
     if(!User) {
        return res.status(400).json({message:"Profile Update Failed"});
     }

     return res.status(200).json({ success: true, message: 'Profile updated' })
     
    }catch(error) {
        res.status(500).json({message:"Internal Server Error"});
    }
}) // handles update logic of user profile


module.exports = UserProfileRouter;
