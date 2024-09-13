const bcrypt = require('bcrypt');

const ComparePassword = (plainTextPassword,hashedPassword) => {
 const result = bcrypt.compareSync(plainTextPassword,hashedPassword);
 return result;
}

module.exports = ComparePassword;
