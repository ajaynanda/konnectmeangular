const Userdb = require('../Model/user')
const bcrypt = require('bcrypt')
const jwt =require('jsonwebtoken')
const otpdb=require('../Model/otp')
require("dotenv").config()
const Emailsend=require('../Middlewares/emailsend')
const Alluser = ((req,res) => {
    return new Promise((resolve, reject) => {
        Userdb.find().then((result) => {
            resolve(result)
        }).catch((err) => {
            console.log(err);
            reject(err)
        })
    })
})
const userRegister = ((req, res) => {
    console.log(req.body);
    return new Promise((resolve, reject) => {
        Userdb.findOne({ Email: req.body.email }).then(async (user) => {
            if (user) {
                reject({ Success: false, message: "user Already exixts", data: user })
            } else {
                const hashPassword = await bcrypt.hash(req.body.password, 10)
                const user = new Userdb({
                    Firstname: req.body.fname,
                    Lastname: req.body.lname,
                    Email: req.body.email,
                    Password: hashPassword
                })
                user.save(user).then(async (result) => {
                    console.log(user);
                    const id = user._id.toString()
                    const userid = ({
                        userid: id
                    })
                    await Userdb.findByIdAndUpdate(id, userid).then((data) => {
                    
                        resolve(result)
                    })
                }).catch(err => {
                    reject(err)
                })
            }
        })
    })
})
const userLogin=((req, res) => {
    console.log(req.body);
    return new Promise((resolve, reject) => {
        
        Userdb.findOne({ Email: req.body.email }).then((user) => {
           
            if (!user) {
                return reject({ Error: true, Message: "Email incorrect" })
            }
            if (user) {
                const password = user.Password
                bcrypt.compare(req.body.password, password).then((users) => {
                    console.log(users);
                    if (!users) {
                        return reject({ Error: true, Message: "Password Incorrect " })
                    }
                    if (users) {
                        const data = {
                            name: user.Firstname,
                            email: user.Email
                        }
                        const token =jwt.sign(data,process.env.key,{expiresIn:'2h'}) 
                    
                        res.cookie('access-token', token, {
                            maxAge: 1000 * 60 * 15,
                            secure: true,
                            httpOnly: true,
                            sameSite: 'lax'
                        })
                        req.token = token
                        return resolve(user)
                    }
                }).catch((err) => {
                    return reject(err);
                })
            }
        })
    })
})
const getuserbyid=((req, res) => {
    return new Promise((resolve, reject) => {
        const id = req.params.id
        console.log(id);
        Userdb.findById(id).then((user) => {
            return resolve(user)
        }).catch((err) => {
            return reject({ Error: true, Message: "User not found with the id " + id })
        })
    })
})
const updateUserById = ((req, res) => {
    return new Promise((resolve, reject) => {
        const id = req.params.id
        const user = ({
            Firstname: req.body.fname,
            Lastname: req.body.lname,
            Email: req.body.email,
            City: req.body.city,
            Aboutme: req.body.about,
            Relation: req.body.relation,
            DateofBirth:req.body.dob
        })
        Userdb.findByIdAndUpdate(id, user).then((users) => {
            req.name = users.Firstname
            return resolve(users)
        }).catch(err => {
            return reject({ Error: true, Message: "User not found with the id " + id,err:err })
        })
    })
})
const Deleteuser = ((req, res) => {
    return new Promise((resolve, reject) => {
        const id = req.params.id
        Userdb.findByIdAndDelete(id).then((user) => {
            return resolve(user)
        }).catch(err => {
            return reject({ Error: true, Message: "User not found with the id " + id,err:err })
        })
    })
})
const userLogout = ((req, res, next) => {
    return new Promise((resolve, reject) => {
        console.log(req.session);
        req.session.destroy(function (err) {
            if (err) reject('You are unable to logout now')
            else {
                return resolve('You have Logged out')
            }
        })
    })
})
const ChangePassword = (async (req, res, next) => {
    return new Promise((resolve, reject) => {
        const id = req.params.id
        Userdb.findById(id).then(async (user) => {
            const comparepassword = await bcrypt.compare(req.body.opassword, user.Password)
            if (!comparepassword) {
                return reject({
                    error: true,
                    message: "Current Password is incorrect"
                })
            } else {
                const hashpassword = await bcrypt.hash(req.body.npassword, 10)
                const password = {
                    Password: hashpassword
                }
                Userdb.findByIdAndUpdate(id, password).then((res) => {
                    return resolve(res)
                }).catch(err => {
                    return reject("Error while Changing the password")
                })
            }
        }).catch(err => {
            return reject({ Error: true, message: "Not found the user" })
        })
    })
})
const verifytoken = ((req, res) => {
    return new Promise((resolve, reject) => {
        let authHeader = req.headers.authorization;
        if (authHeader == undefined) {
            return reject({ Error: true, message: "You have already loggedout or no token found" })
        }
        let token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.key, ((err, result) => {
            if (err) return reject({ Error: true, message: "Authentication failed" })
            else {
                resolve(token)
            }
        }))
    })
})
const otpsend=((req,res)=>{
    return new Promise((resolve,reject)=>{
        Userdb.findOne({Email:req.body.email}).then((user)=>{
            if(!user){
                reject({Success:false,message:'Email is invalid'})
            }
            else{
                const otp=Math.floor(Math.random()*90000) + 100000;
                console.log(otp);
                Emailsend(req,otp)
                const data=new otpdb({
                    userid:user.userid,
                    otp:otp,
                    Name:user.Firstname
                })
                data.save(data).then((result)=>{
                    console.log(result);
                    resolve(result)
                }).catch(err=>{
                    console.log(err);
                    reject(err)
                })
            }
        })
    })
})
const otpverification=((req,res)=>{
    return new Promise((resolve,reject)=>{    
        otpdb.findOne({otp:req.body.otp,userid:req.body.userid}).then(async(user)=>{
    if(!user){
        reject({Success:false,message:'otp is invalid'})
    }else{
       resolve()
    }
})     
    })
})
const forgotPassword=((req,res)=>{
    return new Promise((resolve,reject)=>{
        Userdb.findOne({Email:req.body.email}).then(async(user)=>{
            console.log(user);
            const hashPassword=await bcrypt.hash(req.body.npassword,10)
            console.log(hashPassword);
            const password={
                Password:hashPassword
            }
            console.log(password);
            const id=user._id
            Userdb.findByIdAndUpdate(id,password).then((result)=>{
                resolve(result)
            }).catch(err=>{
                reject({Success:false,message:'Error on changing password'})
            })
        })
        
    })  
})
const userfollow=((req,res)=>{
    return new Promise(async(resolve,reject)=>{
        const cuser=await Userdb.findOne({userid:req.body.userid})
        const user=await Userdb.findOne({_id:req.params.id})
        console.log(cuser);
        console.log(user);
        if(!user.Followers.includes(req.body.userid)){
            await user.updateOne({$push:{Followers:req.body.userid}})
            await cuser.updateOne({$push:{Followings:req.params.id}})
            resolve(user)
        } else{
            reject({Sucess:false,message:'You are aready following this user'})
        }
        
    })
})
const userunfollow=((req,res)=>{
    return new Promise(async(resolve,reject)=>{
        const cuser=await Userdb.findOne({userid:req.body.userid})
        const user=await Userdb.findOne({_id:req.params.id})
        console.log(cuser);
        console.log(user);
        if(user.Followers.includes(req.body.userid)){
            await user.updateOne({$pull:{Followers:req.body.userid}})
            await cuser.updateOne({$pull:{Followings:req.params.id}})
            resolve(user)
        } else{
            reject({Sucess:false,message:'You are already unfollowing this user'})
        }
    })
})
module.exports = { Alluser, userRegister,userLogin,getuserbyid,updateUserById,verifytoken,Deleteuser,ChangePassword,userLogout,otpverification,forgotPassword,otpsend,userfollow,userunfollow}