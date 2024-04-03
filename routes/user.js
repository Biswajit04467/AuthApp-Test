const express = require('express');
const router = express.Router();

//import controller

const { signup, signin } = require('../controllers/Auth')

//api router

router.post("/signup", signup);

router.post("/signin", signin);

// protected route
const { authenticate, isStudent } = require('../middlewares/auth');

router.get("/test", authenticate, (req, res) => {
    return res.status(200).json({
        success: true,
        messege: "Authentication successful !",
        user: req.user
    })
})


router.get("/student", authenticate,isStudent, (req, res) => {
    return res.status(200).json({
        success: true,
        messege: "Welcome to protected route for Students",
        user: req.user
    })
})

module.exports = router;