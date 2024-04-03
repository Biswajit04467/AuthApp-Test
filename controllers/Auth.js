const mongoose = require('mongoose');
const user = require('../model/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already existed !"
            })
        }
        //secure passowrd
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "failed to hash password !"
            })
        }

        //entry to db

        const newUser = await user.create({ name, email, password: hashedPassword, role });

        return res.status(200).json({
            success: true,
            message: "DB entry successfull",
            user: newUser
        })

    } catch (error) {
        return res.status(500).json({
            success: "false",
            message: "Entry failed to DB",
            error: error
        })
    }
}


//signin
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: "false",
                message: "please fill neccessary details"
            });

        }

        //checking for registered user..!
        let registeredUser = await user.findOne({ email });
        if (!registeredUser) {
            return res.status(401).json({
                success: false,
                message: "Register first "
            })
        }

        //verify password and generate jwt token 

        const payload = {
            email: registeredUser.email,
            id: registeredUser._id,
            role: registeredUser.role
        }
        require('dotenv').config();
        const JWT_SECRET = process.env.JWT_SECRET;

        //check password
        if (await bcrypt.compare(password, registeredUser.password)) {
            //password matched 
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" }); //generating token

            registeredUser = registeredUser.toObject();
            registeredUser.token = token; // assigning token to user
            registeredUser.password = undefined; //removing passowrd for security

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            // res.cookie("token", token, options).status(200).json({
            //     success: true,
            //     message: "User logged in successfully",
            //     registeredUser
            // });

            res.status(200).json({
                success: true,
                message: "User logged in successfully",
                registeredUser
            });

        }
        else {
            //password didn't match

            return res.status(403).json({
                success: false,
                message: "Incorrect password"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login failed ",
            error: error
        })
    }
}