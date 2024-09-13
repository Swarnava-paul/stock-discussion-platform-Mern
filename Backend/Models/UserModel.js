const mongoose = require('mongoose');

const userSchema  = new mongoose.Schema({
name :{type:String,required:true},
userId:{type:String,required:true},
email:{type:String,required:true},
password:{type:String,required:true},
profilePicture:{type:String,default:null},
bio:{type:String},
profileCreationDate :{type:Date,default : ()=>new Date()}
},{versionKey:false})

const UserModel = mongoose.model('User',userSchema);

module.exports = UserModel;