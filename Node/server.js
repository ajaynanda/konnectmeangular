const express=require('express')
const app=express()
const  cors=require('cors')
const bodyParser = require("body-parser")
const connectdb=require('./ConnectionDB/db')
const morgan=require('morgan')
const router=require('./Routes/user')
const route=require('./Routes/post')
const routes=require('./Routes/admin')
const session = require('express-session')
app.use(session({
    secret:"jhjhlkjbbdlkfjbwlkejblkjwbjnljnw;lvhnwl;jenbljkh",
    saveUninitialized:true,
    resave:false
}))
app.use(morgan('tiny'))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
require('dotenv').config()
app.use("/",router)
app.use('/',route)
app.use('/',routes)
app.listen(5000,()=>{
    console.log(`Server Listening on Port ${process.env.PORT}`);
})