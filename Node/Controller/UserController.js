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
    // console.log(req.body);
    return new Promise((resolve, reject) => {
        
        Userdb.findOne({ Email: req.body.email }).then((user) => {
           console.log(user);
           
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
    return new Promise(async(resolve, reject) => {
        const id = req.params.id
        console.log(id);
        const allUsers=await Userdb.find()
        const currentUser = await Userdb.findById(req.params.id).populate('Friends Followers Followings');
        Userdb.findById(id).then(async(user) => {
            const commonFriends =await user.Followers.filter(follower =>
                user.Followings.some(following => following._id === follower._id))
                .map(follower => ({
                Firstname: follower.Firstname,
                Lastname: follower.Lastname,
                Name: follower.Name,
                _id: follower._id,
                Profilepic: follower.Profilepic,
                dob: follower.dob, 
            }));
            console.log(commonFriends,"cf");
            
            // Step 3: Add new common friends and remove those not in the common list
            if(commonFriends.length>0){    
                // await Userdb.findByIdAndUpdate(req.params.id, {
                //     $addToSet: { Friends: { $each: commonFriends } }
                // });
                await Userdb.findByIdAndUpdate(req.params.id, {
                    Friends: commonFriends
                });
            }
            const suggestionArray = await allUsers.filter(user => {
                return (
                    String(user._id) !== String(req.params.id) && // Exclude the current user
                    (currentUser.Friends || []).every(friend => {
                        return String(friend._id) !== String(user._id); // Compare IDs as strings
                    })
                );
            });
            const suggestionsWithText =await suggestionArray.map(user => {
                const isFollower = (currentUser.Followers || []).some(follower => {
                    return String(follower._id) === String(user._id); // Compare IDs as strings
                });
                
                const isFollowing = (currentUser.Followings || []).some(following => {
                    return String(following._id) === String(user._id); // Compare IDs as strings
                });
        
                let text;
                if (isFollower && !isFollowing) {
                    text = "Follow back";
                } else if (isFollowing && !isFollower) {
                    text = "Unfollow";
                } else {
                    text = "Follow";
                }
        
                return {
                    _id: user._id,
                    profilePic:user?.Profilepic,
                    Name: `${user.Firstname} ${user.Lastname}`,
                    text: text
                };
            });
            if(suggestionsWithText.length>0){                
                await Userdb.findByIdAndUpdate(req.params.id, {
                    userSuggestion: suggestionsWithText
                });
            }
            return resolve(user)
        }).catch((err) => {
            return reject({ Error: true, Message: "User not found with the id " + id,err:err })
        })
    })
})
const updateUserById = ((req, res) => {
    return new Promise((resolve, reject) => {
        const id = req.params.id
        const user = ({
            Firstname: req.body.fname,
            Lastname: req.body.lname,
            City: req.body.city,
            Aboutme: req.body.description,
            Relation: req.body.relation,
            DateofBirth:req.body.dob
        })
        // console.log(user)
        Userdb.findByIdAndUpdate(id, user).then((users) => {
            console.log(users,"node userbyid updates");
            Userdb.findById(id).then((data)=>{
                console.log(data,"mono");
                res.name = data.Firstname
                return resolve(data)
            })
           
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
            console.log(req.body.opassword)
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
                reject({Success:false,message:'Email is not Registered,Try Again'})
            }
            else{
                const otp=Math.floor(Math.random()*90000) + 100000;
                console.log(otp,"otp send user ");
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
        const cuser=await Userdb.findOne({userid:req.params.userid})
        const user=await Userdb.findOne({_id:req.params.id})
        console.log(cuser,"cuser");
        console.log(user,'user');
        const includes=user.Followers.some((item)=>item._id===req.params.userid)
        console.log(includes,"ok")
        if(!includes){
            await user.updateOne({$push:{Followers:{
                Firstname:cuser.Firstname,
                Lastname:cuser.Lastname,
                Name:`${cuser.Firstname} ${cuser.Lastname}`,
                _id:cuser.userid,
                dob:cuser.DateofBirth,
                Profilepic:cuser.Profilepic
             }}})
            await cuser.updateOne({$push:{Followings:{
                Firstname:user.Firstname,
                Lastname:user.Lastname,
                Name:`${user.Firstname} ${user.Lastname}`,
                _id:user.userid,
                dob:user.DateofBirth,
                Profilepic:user.Profilepic
             }}})
        resolve(cuser)
        } else{
            reject({Sucess:false,message:'You are already following this user'})
        }
        
    })
})
const userunfollow=((req,res)=>{
    return new Promise(async(resolve,reject)=>{
        const cuser=await Userdb.findOne({userid:req.params.userid})
        const user=await Userdb.findOne({_id:req.params.id})
        console.log(cuser);
        console.log(user);
        const includes=user.Followers.some((item)=>item._id===req.params.userid)
        console.log(includes,"ok")
        if(includes){
            await user.updateOne({$pull:{Followers:{
                Firstname:cuser.Firstname,
                Lastname:cuser.Lastname,
                Name:`${cuser.Firstname} ${cuser.Lastname}`,
                _id:cuser._id,
                dob:cuser.DateofBirth,
                Profilepic:cuser.Profilepic
             }}})
            await cuser.updateOne({$pull:{Followings:{
                Firstname:user.Firstname,
                Lastname:user.Lastname,
                Name:`${user.Firstname} ${user.Lastname}`,
                _id:user._id,
                dob:user.DateofBirth,
                Profilepic:user.Profilepic
             }}})
          await  resolve(cuser)
        } else{
            reject({Sucess:false,message:'You are already unfollowing this user'})
        }
    })
})
const removeFollower=((req,res)=>{
    return new Promise(async(resolve,reject)=>{
        const user=await Userdb.findOne({_id:req.params.userid})
        const fuser=await Userdb.findOne({_id:req.params.followerid})
        console.log(user);
        const includes=user.Followers.some((item)=>item._id===req.params.followerid)
        if(includes){
            await user.updateOne({$pull:{Followers:{_id:req.params.followerid}}})
            await fuser.updateOne({$pull:{Followings:{_id:req.params.userid}}})
            resolve(user)     
        }else{
            reject({success:false,message:'Cannot remove user'})
        }
         
    })
})
module.exports = { Alluser, userRegister,userLogin,getuserbyid,updateUserById,verifytoken,Deleteuser,ChangePassword,userLogout,otpverification,forgotPassword,otpsend,userfollow,userunfollow,removeFollower}