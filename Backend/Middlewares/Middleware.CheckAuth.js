const jwt = require('jsonwebtoken');

const checkAuthentication = (req,res,next) => {

    if(!req.headers['authorization']) {
        return res.status(400).json({message:"Please Provide Authorization Header"});
    }

    const token  = req.headers['authorization'].split(" ")[1];

    if(!token) {
        return res.status(400).json({message:"No Token Provided"})
    }

    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decode)=>{
        if(err) {
            return res.status(400).json({message:"Invalid Token"})
        }

       req.user = decode;
       return next();
    })
}

module.exports = checkAuthentication;