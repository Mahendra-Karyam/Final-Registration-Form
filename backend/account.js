const { useState } = require("react");
const { User } = require("./database.js");
const bcrypt = require("bcrypt");

const signUp_User = async( req, res ) => {
    try{
        const { username, email, password } = req.body;
        const existingUserWith_email = await User.findOne({ email });
        if (existingUserWith_email) {
            return res.status(400).json({
                success: false,
                message: `User already exists with the email ${email}. Please try again with a different email.`
            });
        }
        else{
            const salt  = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = await User.create({
                username,
                email,
                password : hashedPassword
            })
            res.status(201).json({
                success : true,
                message : `User with the ${email} registered successfully!`,
                data : {
                    username : newUser.username,
                    email : newUser.email
                }
            })
        }
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: 'Something went wrong during registration, please try again later!'
        })
    }
}

const login_User = async( req, res ) => {
    try{
        let dataToPrintOnConsole = "";
        const { email, password } = req.body;
        const existingUserWith_email = await User.findOne({ email });
        if(!existingUserWith_email){
            dataToPrintOnConsole = "Not Registered or Not existed!";
            console.log(dataToPrintOnConsole);
            return res.status(400).json({
                success : false,
                message: `User with the email ${email} is not signed up. Please sign up first!`
            })
        }
        else{
            const comparePassword = await bcrypt.compare(password, existingUserWith_email.password);
            if(!comparePassword){
                dataToPrintOnConsole = "Password doesn't match, Please try again with the another password!";
                console.log(dataToPrintOnConsole);
                return res.status(400).json({
                    success : false,
                    message : "Invalid Password"
                })
            }
            else{
                dataToPrintOnConsole = "Logged in successfully!";
                console.log(dataToPrintOnConsole);
                res.status(201).json({
                    success : true,
                    message : `User with the ${email} logged in successfully!`,
                    data : {
                        username : existingUserWith_email.username,
                        email : existingUserWith_email.email
                    }
                })
                
            }
        }
    }

    catch(error){
        res.status(500).json({
            success: false,
            message: 'Something went wrong during login, please try again later!'
        })
    }
}

module.exports = {
    signUp_User,
    login_User
}