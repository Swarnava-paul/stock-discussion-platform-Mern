const bcrypt = require('bcrypt');

const HashPassword = (plainTextPassword) => {
 const hashedPassword = bcrypt.hashSync(plainTextPassword,10);
 return hashedPassword;
}

module.exports = HashPassword;
