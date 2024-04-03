const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET; // from .env (signature)

exports.authenticate = async (req, res, next) => {
    try {
        
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "");
        if (!token) {
            return res.status(400).json({
                success: false,
                message: " no token found "
            })
        }
    
        try {
            const decode = jwt.verify(token, JWT_SECRET);

            //assigning token details to user 
            req.user = decode;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "invalid token"
            })
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong "
        });
    }
}

exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.role != "Student") {
            return res.status(401).json({
                success: false,
                message: "This route is protected for Students !"
            })
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "user kkrole cannot be verified  ",
            error: error
        });

    }
}