const jwt = require('jsonwebtoken');

const checkAuthentication = (req,res,next) => {

    if(!req.headers['authorization']) {
        return res.status(400).json({message:"Please Provide Authorization Header"});
    } // check first if authorization header is exist or not

    const token  = req.headers['authorization'].split(" ")[1];

    if(!token) {
        return res.status(400).json({message:"No Token Provided"})
    } // if authorization header is there but no token provided

    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decode)=>{
        if(err) {
            return res.status(400).json({message:"Invalid Token"})
        }

       req.user = decode; // append decoded token object to req.user
       return next(); // return and call next
    }) // verify token if token there
}
// handles user Authentication checking by verifying jwt token

module.exports = checkAuthentication;