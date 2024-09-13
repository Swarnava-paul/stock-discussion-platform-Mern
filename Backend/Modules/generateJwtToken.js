const jwt = require('jsonwebtoken');

const generateJwtToken = (payload) => {
 const token = jwt.sign({...payload},process.env.JWT_SECRET_KEY,{algorithm:'HS256'});
 return token;
}

module.exports = generateJwtToken;
