const mongoose = require('mongoose');
require('dotenv').config();

exports.dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL).then(() => {
        console.log("DB connected successfully..!")
    }).catch((err) => {
        console.log("DB connection failed -->", err);
    })
}