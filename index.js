const express = require('express');
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3000

//middleware
app.use(express.json());
app.use(cookieParser());  // for using req.cookie

//import routes for user
const userRoute = require('./routes/user');
app.use("/api/v1", userRoute)

const { dbConnect } = require('./config/database');
dbConnect();

app.listen(PORT, () => {
    console.log(`server starteds At ${PORT} port`)
});
