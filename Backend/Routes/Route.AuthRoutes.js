const express = require('express');
const AuthRouter = express.Router() ;
const UserModel = require('../Models/UserModel');

AuthRouter.use(express.json()); // for receive incoming request body

// modules
const HashPassword = require('../Modules/HashPassword');
const ComparePassword = require('../Modules/ComparePassword');
const generateJwtToken = require('../Modules/generateJwtToken');

AuthRouter.get('/authRouteHealthCheck',(req,res)=>{
    res.end("Auth Router working Fine")
}); // Endpoint for AuthRouter health check

AuthRouter.post('/register',async(req,res)=>{

    try {
      const {email,password,userName,name,bio} = req.body;

      if (!email && !password && !userName && !name) {
        return res.status(200).json({message:"Please Provide Email & Password & userName to Register"})
      }

      const User = await UserModel.findOne({$or:[{email:{$eq:email}},{userId:{$eq:userName}}]});

      if(User) {
        return res.status(200).json({message:"Email or userName is already Registered With Us"});
      }
      
      const hashedPassword = HashPassword(password); // function to hash the normal password
      const createUser = await UserModel.create({email,userId:userName,password:hashedPassword,name,bio}); // create user in db

      if (createUser) {
        return res.status(201).json({ success: true, message: 'User registered successfully', 
        userName:createUser.userId });
      } // if user created successful 
      
      return res.status(200).json({message:"Registration Failed Please Try Again Later"})  // incase for somehow registration not successful

    }catch (error) {
      res.status(500).json({message:"Internal Server Error"});
    }
}) // this endpoint handles the registration login

AuthRouter.post('/login',async(req,res)=>{

    try {
      const {email,password} = req.body;
      if(!email && !password) {
        return res.status(200).json({message:"Please Provide Email & Password for Login"})
      } // if email password is not present then 

      const User = await UserModel.findOne({email:email});
      if (!User) {
      return res.status(400).json({message:"Wrong Email Id"})
      } // if no user found associated with email

      const result = ComparePassword(password,User.password);

      if(result == true) {
       const {email,userId , name , _id} = User
       const token = generateJwtToken({userId,name,_id})
       return res.status(200).json({token, user: { username : userId, email }})
      } // if given password matched with found users hashed password

      return res.status(400).json({message:"Wrong Password"}); // in case if password is wrong

    }catch(error) {
      res.status(500).json({message:"Internal Server Error"});
    }
}) // this endpoint handles the login logic


module.exports = AuthRouter;