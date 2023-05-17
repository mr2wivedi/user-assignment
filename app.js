const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

//regular middleware 
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//ccokie and fileupload middleware
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));


// routes imported

const user = require('./routes/user');


//router middleware

app.use('/api/v1',user);

module.exports = app