require('dotenv').config();

const express = require('express');

const server = express();

// database connector
const database = require('./Config/Connection.Db');

// middleware
const checkAuthentication = require('./Middlewares/Middleware.CheckAuth');

// routes
const AuthRouter = require('./Routes/Route.AuthRoutes');
const UserProfileRouter = require('./Routes/Route.UserProfile');
const ServiceRouter = require('./Routes/Route.Services');


server.get('/serverHealthCheck',(req,res)=>{
    res.status(200).end('Server is Running OK')
}) // server healthCheck route

server.use('/api/auth',AuthRouter); // authRouter handles all work related to authentication
server.use('/api/user',checkAuthentication,UserProfileRouter); // handles user profile related operations
server.use('/api/posts',checkAuthentication,ServiceRouter); // handles all request related to stock platform

server.listen(process.env.PORT,async()=>{
    try {
    console.log(`server is running on ${process.env.PORT}`);
    database.connect; // method to create connection with db
    }catch (error) {
    console.log(error);        
    }
}) 
// litening to server