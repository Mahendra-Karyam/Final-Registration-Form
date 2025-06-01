const mongoose = require("mongoose");
const { type } = require("os");
require("dotenv").config();
const MONGODB_URI = process.env.MONGODB_URI;

const connectToMongoDB = async() => {
    try{
        await mongoose.connect(MONGODB_URI);
        console.log("MongoDB connected successfully!");
    }
    catch(error){
        console.log("Error connecting to MongoDB:", error);
    }
}

const userSchema = new mongoose.Schema({
    username : {
        type : String
    },
    email : {
        type : String
    },
     password : {
        type : String
    }
})

const User = mongoose.model('User', userSchema);
module.exports = {
    connectToMongoDB,
    User
}